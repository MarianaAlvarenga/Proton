import React from "react";
import NavBar from "../common/NavBar";
import SubNavBar from "../common/SubNavBar";
import ProductImage from "./ProductImage";
import ProductCreateForm from "./ProductCreateForm";
const ProductsCreate = () => {
    return(
        <>
            <NavBar showMenu showSearch></NavBar>
            <SubNavBar showBack></SubNavBar>
            <ProductImage></ProductImage>
            <ProductCreateForm></ProductCreateForm>
        </>
    );
};

export default ProductsCreate;