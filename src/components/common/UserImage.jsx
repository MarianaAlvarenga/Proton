import React from "react";
import DefaultUserImage from '../../assets/images/usuario.png'; // Importación estática de la imagen por defecto

const UserImage = ({ urlImage = DefaultUserImage }) => {
    return(
        <figure className="image is-inline-block" style={{ marginBottom: '20px', marginTop: '20px', paddingLeft: '20px' }}>
            <img className="is-rounded" 
            src={urlImage} 
            style={{height:'100px', width:'100px'}}
            />
        </figure>
    );
};

export default UserImage;