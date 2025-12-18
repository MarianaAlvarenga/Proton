import React, { useRef, useState, useEffect } from "react";
import DefaultUserImage from "../../assets/images/usuario.png";

const UserImage = ({ userId, onTempImageSelected }) => {
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(DefaultUserImage);

    const fetchUserImage = async () => {
        try {
            const response = await fetch(
                `https://charter-driver-acid-smile.trycloudflare.com/backend/actions/get_user_image.php?userId=${userId}`,
                { credentials: "include" }
            );

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            setSelectedImage(
                data.img_url
                    ? `http://localhost:8080/Proton/backend/uploads/${data.img_url}?t=${Date.now()}`
                    : DefaultUserImage
            );
        } catch (error) {
            console.error("Error al obtener imagen:", error);
            setSelectedImage(DefaultUserImage);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUserImage();
        } else {
            // En registro (sin userId) mostramos placeholder
            setSelectedImage(DefaultUserImage);
        }
    }, [userId]);

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validación de tamaño
        if (file.size > 2 * 1024 * 1024) {
            alert("La imagen no debe exceder 2MB");
            return;
        }

        // CASO REGISTRO (sin userId)
        if (!userId) {
            try {
                // Crear preview local
                const imageUrl = URL.createObjectURL(file);
                setSelectedImage(imageUrl);

                // Notificar al padre
                if (typeof onTempImageSelected === "function") {
                    onTempImageSelected(file);
                }

            } catch (error) {
                console.error("Error procesando imagen:", error);
                alert("Error al procesar la imagen seleccionada");
            } finally {
                if (fileInputRef.current) fileInputRef.current.value = "";
            }
            return;
        }

        // CASO 2: EDICIÓN (con userId): subir al servidor
        const formData = new FormData();
        formData.append("image", file);
        formData.append("userId", userId.toString());

        try {
            const response = await fetch(
                "https://charter-driver-acid-smile.trycloudflare.com/backend/actions/upload_user_image.php",
                {
                    method: "POST",
                    body: formData,
                    credentials: "include"
                }
            );

            const responseText = await response.text();
            if (!response.ok) {
                let errorData = {};
                try {
                    errorData = JSON.parse(responseText);
                } catch (e) {
                    // respuesta no JSON
                }

                throw new Error(
                    errorData.message ||
                    `Error del servidor (${response.status}): ${responseText || 'Sin detalles'}`
                );
            }

            const data = JSON.parse(responseText);

            if (!data.success) {
                throw new Error(data.message || "Error al procesar la imagen");
            }

            setSelectedImage(
                `http://localhost:8080/Proton/backend/uploads/${data.img_url}?t=${Date.now()}`
            );
            alert("¡Imagen actualizada correctamente!");

        } catch (error) {
            console.error("Detalle completo del error:", error);
            alert(`Error al subir la imagen:\n${error.message}`);
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div>
            <a onClick={handleClick} style={{ cursor: "pointer" }}>
                <figure style={{ padding: "10px" }}>
                    <img
                        src={selectedImage}
                        alt="Foto de perfil"
                        style={{
                            width: "128px",
                            height: "128px",
                            borderRadius: "100%",
                            objectFit: "cover",
                            border: "2px solid #ddd"
                        }}
                    />
                </figure>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                    accept="image/jpeg, image/png"
                />
            </a>
        </div>
    );
};

export default UserImage;
