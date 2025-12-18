import React, { useRef, useState, useEffect } from "react";
import DefaultPetImage from "../../assets/images/perro.png";

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
            // Si hay petId, pedir imagen desde backend
            if (petId) {
                const response = await fetch(
                    `https://enhancement-flashing-comparative-respondents.trycloudflare.com/backend/actions/get_pet_image.php?petId=${petId}`,
                    { credentials: "include" }
                );

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const data = await response.json();
                setSelectedImage(
                    data.img_url
                        ? `https://enhancement-flashing-comparative-respondents.trycloudflare.com/backend/uploads/${data.img_url}?t=${Date.now()}`
                        : DefaultPetImage
                );
            } else {
                // Si no hay petId, puede que tengamos una imagen provisional en mascotaEdit.img_url
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
        // Cada vez que cambia petId o la mascotaEdit.img_url, refrescar preview
        fetchPetImage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [petId, mascotaEdit?.img_url]);

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validación cliente adicional
        if (file.size > 2 * 1024 * 1024) { // 2MB
            alert("La imagen no debe exceder 2MB");
            return;
        }

        // Si no hay petId (estamos creando), solo generar preview y guardar el file en mascotaEdit
        if (!petId) {
            const previewUrl = URL.createObjectURL(file);
            setSelectedImage(previewUrl);
            if (setMascotaEdit) {
                setMascotaEdit(prev => ({
                    ...prev,
                    pendingImageFile: file,
                    img_url: previewUrl // uso temporal para mostrar preview
                }));
            }
            // No intentar subir al servidor todavía (no hay id)
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        // Si hay petId -> subir al servidor (flujo de edición existente)
        const formData = new FormData();
        formData.append("image", file);
        formData.append("petId", petId.toString());


        try {
            const response = await fetch(
                "https://charter-driver-acid-smile.trycloudflare.com/backend/actions/upload_pet_image.php",
                {
                    method: "POST",
                    body: formData,
                    credentials: "include"
                }
            );


            const responseText = await response.text();
            console.log("Respuesta completa del servidor:", responseText); // Debug


            if (!response.ok) {
                let errorData = {};
                try {
                    errorData = JSON.parse(responseText);
                } catch (e) {
                    console.error("No se pudo parsear la respuesta de error:", e);
                }


                throw new Error(
                    errorData.message ||
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
