import React from "react";

const UserImage = () => {
    return(
        <figure className="image is-64x64 is-inline-block" style={{ marginBottom: '20px' }}>
            <img class="is-rounded" src={require('../../assets/images/usuario.png')}/>
        </figure>
    );
};

export default UserImage;