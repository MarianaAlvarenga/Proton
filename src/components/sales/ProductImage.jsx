import React, { useRef, useState, useEffect } from "react";
import DefaultImage from '../../assets/images/DefaultImage.png'; // Imagen por defecto

const ProductImage = ({ onImageUpload, imageUrl }) => {
    const [selectedImage, setSelectedImage] = useState(DefaultImage);
    const fileInputRef = useRef(null);

    // Carga la imagen existente si llega por props
    useEffect(() => {
        if (imageUrl) {
            setSelectedImage(imageUrl);
        }
    }, [imageUrl]);

    // Cambia la imagen cuando el usuario sube un archivo nuevo
    const handleFileChange = (event) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            if (onImageUpload) {
                onImageUpload(file);
            }
        } else {
            console.error('No se seleccionó un archivo válido');
        }
    };

    // Abre el input al hacer clic en la imagen
    const handleClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div>
            <a onClick={handleClick} style={{ cursor: 'pointer' }}>
                <figure className="image is-128x128" style={{ padding: '10px' }}>
                    <img 
                        src={selectedImage} 
                        style={{ width: '100%', height: 'auto' }} 
                        alt="Vista previa del producto" 
                    />
                </figure>
                <input 
                    type="file"
                    name="image_url"
                    ref={fileInputRef} 
                    style={{ display: 'none' }} 
                    onChange={handleFileChange} 
                    accept="image/*"
                />
            </a>
        </div>
    );
};

export default ProductImage;
