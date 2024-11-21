import React from "react";
import OkButton from "../common/OkButton";
import './ButtonPanelUsers.css';
import { AddButton, ModifyButton, DeleteButton } from "../common/Buttons";
const ButtonPanelUsers = () =>{
    return(
        <div className="button-container">
            <AddButton></AddButton>
            <ModifyButton></ModifyButton>
            <DeleteButton></DeleteButton>
        </div>
    );
}

export default ButtonPanelUsers;