import React from "react";
import NavBar from "../components/common/NavBar";
import SubNavBar from "../components/common/SubNavBar";
const Products = () => {
    return(
        <>
            <NavBar showMenu showSearch></NavBar>
            <SubNavBar showCart showBack></SubNavBar>
        </>
    );
};

export default Products;