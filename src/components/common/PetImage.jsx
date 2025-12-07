import React, { useRef, useState, useEffect } from "react";
import DefaultPetImage from "../../assets/images/perro.png";

const PetImage = ({ petId }) => {
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(DefaultPetImage);

    const fetchPetImage = async () => {
        try {
            const response = await fetch(
                `https://favourites-roof-lone-welcome.trycloudflare.com/backend/actions/get_pet_image.php?petId=${petId}`,
                { credentials: "include" }
            );

            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }

            const data = await response.json();
            console.log(response); //EMC2
            setSelectedImage(
                data.img_url
                    ? `http://localhost:8080/Proton/backend/uploads/${data.img_url}?t=${Date.now()}`
                    : DefaultPetImage
            );
        } catch (error) {
            console.error("Error al obtener imagen:", error);
            setSelectedImage(DefaultPetImage);
        }
    };

    useEffect(() => {
        if (petId) {
            console.log("HOLA");
            fetchPetImage();
        } else {
            console.log("NO HAY PET ID");
        }
    }, [petId]);

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file || !petId) return;

        // Validación cliente adicional
        if (file.size > 2 * 1024 * 1024) { // 2MB
            alert("La imagen no debe exceder 2MB");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);
        formData.append("petId", petId.toString());

        try {
            const response = await fetch(
                "https://favourites-roof-lone-welcome.trycloudflare.com/backend/actions/upload_pet_image.php",
                {
                    method: "POST",
                    body: formData,
                    credentials: "include"
                }
            );

            const responseText = await response.text();
            console.log("Respuesta completa del servidor:", responseText); // Debug

            if (!response.ok) {
                // Intentar parsear el error si es JSON
                let errorData = {};
                try {
                    errorData = JSON.parse(responseText);
                } catch (e) {
                    console.error("No se pudo parsear la respuesta de error:", e);
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
            console.error("Detalle completo del error:", {
                error: error,
                fileInfo: {
                    name: file.name,
                    size: file.size,
                    type: file.type
                }
            });

            alert(`Error al subir la imagen:\n${error.message}\n\n` +
                `Detalles técnicos:\n` +
                `- Tipo: ${file.type}\n` +
                `- Tamaño: ${Math.round(file.size / 1024)}KB\n` +
                `- Nombre: ${file.name}`);
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
                        alt="Foto de mascota"
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

export default PetImage;