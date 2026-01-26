import React, { useRef, useState, useEffect } from "react";
import DefaultUserImage from "../../assets/images/usuario.png";
import Alert from "../common/Alert";

const UserImage = ({ userId, onTempImageSelected }) => {
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(DefaultUserImage);

    const fetchUserImage = async () => {
        try {
            const response = await fetch(
                `https://tool-crossing-ranges-flour.trycloudflare.com/backend/actions/get_user_image.php?userId=${userId}`,
                { credentials: "include" }
            );

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();

            if (!data.img_url) {
                setSelectedImage(DefaultUserImage);
            } else if (data.img_url.startsWith("http")) {
                setSelectedImage(`${data.img_url}?t=${Date.now()}`);
            } else {
                setSelectedImage(
                    `https://tool-crossing-ranges-flour.trycloudflare.com/backend/uploads/${data.img_url}?t=${Date.now()}`
                );
            }

        } catch (error) {
            console.error("Error al obtener imagen:", error);
            setSelectedImage(DefaultUserImage);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUserImage();
        } else {
            setSelectedImage(DefaultUserImage);
        }
    }, [userId]);

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            Alert({
                Title: "Imagen demasiado grande",
                Detail: "La imagen no debe exceder los 2MB.",
                icon: "error",
                Confirm: "Entendido"
            });
            return;
        }

        if (!userId) {
            try {
                const imageUrl = URL.createObjectURL(file);
                setSelectedImage(imageUrl);

                if (typeof onTempImageSelected === "function") {
                    onTempImageSelected(file);
                }

            } catch (error) {
                console.error("Error procesando imagen:", error);
                Alert({
                    Title: "Error",
                    Detail: "Error al procesar la imagen seleccionada.",
                    icon: "error",
                    Confirm: "Cerrar"
                });
            } finally {
                if (fileInputRef.current) fileInputRef.current.value = "";
            }
            return;
        }

        const formData = new FormData();
        formData.append("image", file);
        formData.append("userId", userId.toString());

        try {
            const response = await fetch(
                "https://tool-crossing-ranges-flour.trycloudflare.com/backend/actions/upload_user_image.php",
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
                } catch (e) { }

                throw new Error(
                    errorData.message ||
                    `Error del servidor (${response.status}): ${responseText || 'Sin detalles'}`
                );
            }

            const data = JSON.parse(responseText);

            if (!data.success) {
                throw new Error(data.message || "Error al procesar la imagen");
            }

            let fileName = data.img_url;

            if (fileName.includes("?")) {
                setSelectedImage(`https://tool-crossing-ranges-flour.trycloudflare.com/backend/uploads/${fileName}`);
            } else {
                setSelectedImage(`https://tool-crossing-ranges-flour.trycloudflare.com/backend/uploads/${fileName}?t=${Date.now()}`);
            }

            Alert({
                Title: "Imagen actualizada",
                Detail: "Tu foto de perfil se actualizó correctamente.",
                icon: "success",
                Confirm: "Perfecto"
            });

        } catch (error) {
            console.error("Detalle completo del error:", error);
            Alert({
                Title: "Error al subir imagen",
                Detail: error.message,
                icon: "error",
                Confirm: "Cerrar"
            });
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    useEffect(() => {
        console.log("USER ID QUE LLEGA A UserImage:", userId);

        if (userId) {
            console.log("Tengo userId chavooon");
            fetchUserImage();
        } else {
            console.log("No tengo userId chavooon");
            setSelectedImage(DefaultUserImage);
        }
    }, [userId]);

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
