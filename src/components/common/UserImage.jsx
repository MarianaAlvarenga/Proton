    import React, { useRef, useState, useEffect } from "react";
    import DefaultUserImage from "../../assets/images/usuario.png";

    const UserImage = ({ userId }) => { // Usamos solo el userId como prop
        const fileInputRef = useRef(null);
        const [selectedImage, setSelectedImage] = useState(DefaultUserImage);

        useEffect(() => {
            const fetchImage = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/Proton/backend/actions/get_user_image.php?userId=${userId}`, {
                        credentials: "include"
                    });
                    
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    
                    const data = await response.json();
                    setSelectedImage(data.img_url 
                        ? `http://localhost:8080/Proton/backend/uploads/${data.img_url}?t=${Date.now()}`
                        : DefaultUserImage);
                } catch (error) {
                    console.error("Error al obtener imagen:", error);
                    setSelectedImage(DefaultUserImage);
                }
            };
            
            const handleFileChange = async (event) => {
                const file = event.target.files?.[0];
                if (!file || !userId) return;
            
                const formData = new FormData();
                formData.append("image", file);
                formData.append("userId", userId.toString());
            
                try {
                    const response = await fetch("http://localhost:8080/Proton/backend/actions/upload_user_image.php", {
                        method: "POST",
                        body: formData,
                        credentials: "include",
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
            
                    // Verificar primero si la respuesta es válida
                    if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`Error ${response.status}: ${errorText}`);
                    }
            
                    const data = await response.json();
                    
                    if (data.success) {
                        setSelectedImage(`http://localhost:8080/Proton/backend/uploads/${data.img_url}?t=${Date.now()}`);
                        alert("¡Imagen subida correctamente!");
                    } else {
                        throw new Error(data.message || "Error al procesar la imagen");
                    }
                } catch (error) {
                    console.error("Detalle completo del error:", {
                        message: error.message,
                        stack: error.stack
                    });
                    alert(`Error al subir imagen: ${error.message}`);
                }
            };
        }, [userId]);

        const handleFileChange = async (event) => {
            const file = event.target.files?.[0];
            if (!file || !userId) return;
        
            const formData = new FormData();
            formData.append("image", file);
            formData.append("userId", userId.toString());
        
            try {
                const response = await fetch("http://localhost:8080/Proton/backend/actions/upload_user_image.php", {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
        
                // Verificar primero si hay error de CORS
                if (response.type === 'opaque') {
                    throw new Error('Error de CORS: No se puede acceder al recurso');
                }
        
                const data = await response.json();
                
                if (data.success) {
                    setSelectedImage(`http://localhost:8080/Proton/backend/uploads/${data.img_url}?t=${Date.now()}`);
                } else {
                    throw new Error(data.message || "Error al subir imagen");
                }
            } catch (error) {
                console.error("Error completo:", error);
                alert("Error al subir imagen 2: " + error.message);
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
                            alt="Vista previa del usuario" 
                            style={{ 
                                width: "128px", 
                                height: "128px", 
                                borderRadius: "50%", 
                                objectFit: "cover" 
                            }} 
                        />
                    </figure>
                    <input 
                        type="file"
                        ref={fileInputRef} 
                        style={{ display: "none" }} 
                        onChange={handleFileChange} 
                        accept="image/*"
                    />
                </a>
            </div>
        );
    };

    export default UserImage;