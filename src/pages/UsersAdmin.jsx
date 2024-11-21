import React from "react";
import NavBar from "../components/common/NavBar";
import SubNavBar from "../components/common/SubNavBar";
import Table from "../components/common/Table";
import ButtonPanelUsers from "../components/users/ButtonPanelUsers";

const UsersAdmin = () => {
    return(
        <div>
            <NavBar showMenu showSearch></NavBar>
            <SubNavBar showBack></SubNavBar>
            <ButtonPanelUsers></ButtonPanelUsers>
            <Table></Table>
        </div>
    );
}

export default UsersAdmin;