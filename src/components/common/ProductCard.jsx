import React from "react";
import "./ProductCard.css"; // Asegúrate de importar el archivo CSS

const ProductCard = ({ProductName = "Producto", ShowAddButton = false, ShowDeleteButton=false, ShowModifyButton=false}) => {
    return (
        <div className="card" style={{borderRadius:'0%'}}>
            <div className="card-image" style={{borderRadius:'0%'}}>
                <figure className="image is-4by3">
                    <img
                        src="https://bulma.io/assets/images/placeholders/1280x960.png"
                        alt="Placeholder image"
                        style={{borderRadius:'0%'}}
                    />
                    {ShowAddButton && (<button className="buttonImage add-button">+</button>)}
                    {ShowDeleteButton && (<button className="buttonImage delete-button">5</button>)}
                    {ShowModifyButton && (<button className="buttonImage modify-button"><img
                        src={require("../../assets/images/modify.png")}
                        alt="ModifyButton"
                        style={{ fill: 'black', color:'white'}}
                    />
                </button>)}
                </figure>
            </div>
            <div className="card-content" style={{height:'2px'}}>
                    {ProductName}
            </div>
        </div>
    );
};

export default ProductCard;
