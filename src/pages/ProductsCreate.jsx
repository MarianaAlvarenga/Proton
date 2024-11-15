import React from "react";
import NavBar from "../components/common/NavBar";
import SubNavBar from "../components/common/SubNavBar";
import ProductImage from "../components/common/ProductImage";
import ProductCreateForm from "../components/common/ProductCreateForm";
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