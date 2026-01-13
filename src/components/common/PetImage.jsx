import React, { useRef, useState, useEffect } from "react";
import DefaultPetImage from "../../assets/images/perro.png";
import Alert from "../common/Alert";

/**
 * Props:
 * - petId: number | undefined
 * - mascotaEdit: object (opcional) -> usado cuando agregás nueva mascota sin id
 * - setMascotaEdit: function (opcional) -> para guardar pendingImageFile / preview
 */
const PetImage = ({ petId, mascotaEdit, setMascotaEdit }) => {
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(DefaultPetImage);

    const fetchPetImage = async () => {
        try {
            if (petId) {
                const response = await fetch(
                    `https://mas-host-least-disciplines.trycloudflare.com/backend/actions/get_pet_image.php?petId=${petId}`,
                    { credentials: "include" }
                );

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const data = await response.json();
                setSelectedImage(
                    data.img_url
                        ? `https://mas-host-least-disciplines.trycloudflare.com/backend/uploads/${data.img_url}?t=${Date.now()}`
                        : DefaultPetImage
                );
            } else {
                if (mascotaEdit && mascotaEdit.img_url) {
                    setSelectedImage(mascotaEdit.img_url);
                } else {
                    setSelectedImage(DefaultPetImage);
                }
            }
        } catch (error) {
            console.error("Error al obtener imagen:", error);
            setSelectedImage(DefaultPetImage);
        }
    };

    useEffect(() => {
        fetchPetImage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [petId, mascotaEdit?.img_url]);

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

        if (!petId) {
            const previewUrl = URL.createObjectURL(file);
            setSelectedImage(previewUrl);
            if (setMascotaEdit) {
                setMascotaEdit(prev => ({
                    ...prev,
                    pendingImageFile: file,
                    img_url: previewUrl
                }));
            }
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        const formData = new FormData();
        formData.append("image", file);
        formData.append("petId", petId.toString());

        try {
            const response = await fetch(
                "https://mas-host-least-disciplines.trycloudflare.com/backend/actions/upload_pet_image.php",
                {
                    method: "POST",
                    body: formData,
                    credentials: "include"
                }
            );

            const responseText = await response.text();
            console.log("Respuesta completa del servidor:", responseText);

            if (!response.ok) {
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

            Alert({
                Title: "Imagen actualizada",
                Detail: "La imagen de la mascota se actualizó correctamente.",
                icon: "success",
                Confirm: "Genial"
            });

        } catch (error) {
            console.error("Detalle completo del error:", {
                error: error,
                fileInfo: {
                    name: file.name,
                    size: file.size,
                    type: file.type
                }
            });

            Alert({
                Title: "Error al subir imagen",
                Detail:
                    `No se pudo subir la imagen.\n\n` +
                    `Motivo: ${error.message}\n` +
                    `Tipo: ${file.type}\n` +
                    `Tamaño: ${Math.round(file.size / 1024)}KB\n` +
                    `Nombre: ${file.name}`,
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
