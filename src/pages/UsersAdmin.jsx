import React, { useState } from "react"; 
import NavBar from "../components/common/NavBar";
import SubNavBar from "../components/common/SubNavBar";
import Table from "../components/common/Table";
import ButtonPanelUsers from "../components/users/ButtonPanelUsers";
import "./UsersAdmin.css";

const UsersAdmin = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null); // 👈 agregado

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    return (
        <div>
            <NavBar showSearch onSearch={handleSearch} />
            <SubNavBar showBack currentPage="Gestión de usuarios" />
            <ButtonPanelUsers selectedUserId={selectedUserId} /> 
            <div className="table-wrapper">
                <Table searchQuery={searchQuery} onSelectUser={setSelectedUserId} />
            </div>
        </div>
    );
};

export default UsersAdmin;
