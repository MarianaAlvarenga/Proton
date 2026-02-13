import React, { useRef, useState, useEffect } from "react";
import DefaultPetImage from "../../assets/images/perro.png";
import Alert from "../common/Alert";

const BACKEND_URL =
    "https://independent-intent-telephone-printer.trycloudflare.com/backend";

const PetImage = ({ petId, mascotaEdit, setMascotaEdit }) => {
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(DefaultPetImage);

    const buildImageUrl = (imgUrl) => {
        if (!imgUrl) return DefaultPetImage;
        return `${BACKEND_URL}/uploads/${imgUrl}?t=${Date.now()}`;
    };

    const fetchPetImage = async () => {
        try {
            if (petId) {
                const response = await fetch(
                    `${BACKEND_URL}/actions/get_pet_image.php?petId=${petId}`,
                    { credentials: "include" }
                );

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const data = await response.json();
                setSelectedImage(buildImageUrl(data.img_url));
            } else {
                if (mascotaEdit?.img_url) {
                    setSelectedImage(buildImageUrl(mascotaEdit.img_url));
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

        // Mascota nueva (sin ID)
        if (!petId) {
            const previewUrl = URL.createObjectURL(file);
            setSelectedImage(previewUrl);

            if (setMascotaEdit) {
                setMascotaEdit(prev => ({
                    ...prev,
                    pendingImageFile: file,
                    img_url: null
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
                `${BACKEND_URL}/actions/upload_pet_image.php`,
                {
                    method: "POST",
                    body: formData,
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || "Error al subir imagen");
            }

            setSelectedImage(buildImageUrl(data.img_url));

            Alert({
                Title: "Imagen actualizada",
                Detail: "La imagen de la mascota se actualizó correctamente.",
                icon: "success",
                Confirm: "Genial"
            });

        } catch (error) {
            Alert({
                Title: "Error al subir imagen",
                Detail: error.message,
                icon: "error",
                Confirm: "Cerrar"
            });
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div>
            <a onClick={() => fileInputRef.current?.click()} style={{ cursor: "pointer" }}>
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
