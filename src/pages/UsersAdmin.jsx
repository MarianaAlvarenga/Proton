import React from "react";
import NavBar from "../components/common/NavBar";
import SubNavBar from "../components/common/SubNavBar";
import Table from "../components/common/Table";
import ButtonPanelUsers from "../components/users/ButtonPanelUsers";

const UsersAdmin = () => {
    return(
        <div>
            <NavBar showSearch></NavBar>
            <SubNavBar showBack currentPage="Gestión de usuarios"></SubNavBar>
            <ButtonPanelUsers></ButtonPanelUsers>
            <Table></Table>
        </div>
    );
}

export default UsersAdmin;