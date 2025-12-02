import React, { useRef, useState, useEffect } from "react";
import DefaultUserImage from "../../assets/images/usuario.png";

const UserImage = ({ userId, onTempImageSelected }) => {
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(DefaultUserImage);

    const fetchUserImage = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/Proton/backend/actions/get_user_image.php?userId=${userId}`,
                { credentials: "include" }
            );
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();

            // 🔥 CAMBIO ÚNICO: completar ruta correctamente
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
            setSelectedImage(DefaultUserImage);
        }
    }, [userId]);

    const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        alert("La imagen no debe exceder 2MB");
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
            alert("Error al procesar la imagen seleccionada");
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
                "http://localhost:8080/Proton/backend/actions/upload_user_image.php",
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
                } catch (e) {}

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
                setSelectedImage(`http://localhost:8080/Proton/backend/uploads/${fileName}`);
            } else {
                setSelectedImage(`http://localhost:8080/Proton/backend/uploads/${fileName}?t=${Date.now()}`);
            }

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
