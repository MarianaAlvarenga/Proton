import React from "react";
import NavBar from "../components/common/NavBar";
import SubNavBar from "../components/common/SubNavBar";
import ProductImage from "../components/common/ProductImage";

const ProductsAdmin = () => {
    return(
        <>
            <NavBar showMenu showSearch />
            <SubNavBar showBack showCart />
            <section className="section">
                <div className="container">
                    <div className="columns is-mobile is-multiline">
                        <div className="column is-half">
                            <ProductImage ProductName="Correa"/>
                        </div>
                        <div className="column is-half">
                            <ProductImage ProductName="Cepillo"/>
                        </div>
                        <div className="column is-half">
                            <ProductImage ProductName="Buzo"/>
                        </div>
                        <div className="column is-half">
                            <ProductImage ProductName="Hueso"/>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProductsAdmin;
