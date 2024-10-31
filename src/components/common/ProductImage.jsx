import React from "react";
import "./ProductImage.css"; // Asegúrate de importar el archivo CSS

const ProductImage = ({ProductName = "Producto"}) => {
    return (
        <div className="card">
            <div className="card-image">
                <figure className="image is-4by3">
                    <img
                        src="https://bulma.io/assets/images/placeholders/1280x960.png"
                        alt="Placeholder image"
                    />
                    {/* Botón "+" en la parte superior derecha */}
                    <button className="add-button">+</button>
                </figure>
            </div>
            <div className="card-content">
                    {ProductName}
            </div>
        </div>
    );
};

export default ProductImage;
