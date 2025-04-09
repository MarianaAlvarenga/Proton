import React, { useRef, useState, useEffect } from "react";
import DefaultUserImage from "../../assets/images/usuario.png";

const UserImage = ({ userId }) => {
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
        }
    }, [userId]);

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file || !userId) return;
    
        // Validación cliente adicional
        if (file.size > 2 * 1024 * 1024) { // 2MB
            alert("La imagen no debe exceder 2MB");
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
                <figure className="image is-128x128" style={{ padding: "10px" }}>
                    <img 
                        src={selectedImage} 
                        alt="Foto de perfil" 
                        style={{ 
                            width: "128px", 
                            height: "128px", 
                            borderRadius: "50%", 
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