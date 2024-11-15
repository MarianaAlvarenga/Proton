import React from "react";
import DefaultImage from '../../assets/images/DefaultImage.png'; // Importación estática de la imagen por defecto

const ProductImage = ({ urlImage = DefaultImage }) => { // Desestructuración correcta de props con valor por defecto
    return (
        <a>
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
        </a>
    );
}

export default ProductImage;
