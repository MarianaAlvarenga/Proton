import React from "react";
import DefaultUserImage from '../../assets/images/usuario.png'; // Importación estática de la imagen por defecto

const UserImage = ({ urlImage = DefaultUserImage }) => {
    return(
        <figure className="image is-64x64 is-inline-block" style={{ marginBottom: '20px', marginTop: '20px', paddingLeft: '20px' }}>
            <img class="is-rounded" 
            src={urlImage} 
            />
        </figure>
    );
};

export default UserImage;