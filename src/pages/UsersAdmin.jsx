import React, { useState } from "react";
import NavBar from "../components/common/NavBar";
import SubNavBar from "../components/common/SubNavBar";
import Table from "../components/common/Table";
import ButtonPanelUsers from "../components/users/ButtonPanelUsers";

const UsersAdmin = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    return (
        <div>
            <NavBar showSearch onSearch={handleSearch} />
            <SubNavBar showBack currentPage="Gestión de usuarios" />
            <ButtonPanelUsers />
            <Table searchQuery={searchQuery} />
        </div>
    );
};

export default UsersAdmin;
