import React, { useRef } from "react";
import DefaultImage from '../../assets/images/DefaultImage.png'; // Importación estática de la imagen por defecto

const ProductImage = ({ urlImage = DefaultImage, onImageUpload }) => {
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        if (onImageUpload) {
            onImageUpload(event.target.files[0]); // Llama a la función de subida con el archivo seleccionado
        }
    };

    const handleClick = () => {
        fileInputRef.current.click(); // Simula un clic en el input file
    };

    return (
        <a onClick={handleClick}>
            <figure className="image is-128x128" style={{ padding: '10px' }}> 
                <img 
                    src={urlImage} 
                    style={{ 
                        width: '100%', 
                        height: 'auto',
                    }}
                    alt="Product" 
                />
            </figure>
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                onChange={handleFileChange} 
                accept="image/*" // Solo permite subir imágenes
            />
        </a>
    );
};

export default ProductImage;
