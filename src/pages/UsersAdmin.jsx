import React, { useState } from "react"; 
import NavBar from "../components/common/NavBar";
import SubNavBar from "../components/common/SubNavBar";
import Table from "../components/common/Table";
import ButtonPanelUsers from "../components/users/ButtonPanelUsers";

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
            <ButtonPanelUsers selectedUserId={selectedUserId} /> {/* 👈 agregado */}
            <Table searchQuery={searchQuery} onSelectUser={setSelectedUserId} /> {/* 👈 agregado */}
        </div>
    );
};

export default UsersAdmin;
