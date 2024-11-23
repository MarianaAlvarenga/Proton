import React, { useRef, useState } from "react";
import DefaultImage from '../../assets/images/DefaultImage.png'; // Importación estática de la imagen por defecto

const ProductImage = ({ onImageUpload }) => {
    const [selectedImage, setSelectedImage] = useState(DefaultImage);
    const fileInputRef = useRef(null);

    // Maneja el cambio de archivo
    const handleFileChange = (event) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            // Establece la imagen seleccionada
            setSelectedImage(URL.createObjectURL(file)); // Vista previa de la imagen

            // Si existe la función onImageUpload, llama con el archivo
            if (onImageUpload) {
                onImageUpload(file); // Llama a la función de subida con el archivo seleccionado
            }
        } else {
            console.error('No se seleccionó un archivo válido');
        }
    };

    // Simula un clic en el input file cuando se hace clic en la imagen
    const handleClick = () => {
        fileInputRef.current.click(); // Simula un clic en el input file
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
                    accept="image/*" // Solo permite subir imágenes
                />
            </a>
        </div>
    );
};

export default ProductImage;
