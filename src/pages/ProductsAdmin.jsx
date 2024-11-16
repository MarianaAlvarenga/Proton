import React from "react";
import NavBar from "../components/common/NavBar";
import SubNavBar from "../components/common/SubNavBar";
import ProductImage from "../components/sales/ProductCard";
import Pagination from "../components/common/Pagination";

const ProductsAdmin = () => {
    return(
        <>
            <NavBar showMenu showSearch />
            <SubNavBar showBack showCart />
            <section className="section" style={{margin:'0px', padding: '1.5rem 1.5rem'}}>
                <div className="container" style={{margin:'0px'}}>
                    <div className="columns is-mobile is-multiline" style={{margin:'0px'}}>
                        <div className="column is-half">
                            <ProductImage ProductName="Correa" ShowAddButton ShowModifyButton/>
                        </div>
                        <div className="column is-half">
                            <ProductImage ProductName="Cepillo" ShowAddButton/>
                        </div>
                        <div className="column is-half">
                            <ProductImage ProductName="Buzo" ShowAddButton/>
                        </div>
                        <div className="column is-half">
                            <ProductImage ProductName="Hueso" ShowAddButton/>
                        </div>
                        <div className="column is-half">
                            <ProductImage ProductName="Gallina" ShowAddButton/>
                        </div>
                        <div className="column is-half">
                            <ProductImage ProductName="Pelota" ShowAddButton/>
                        </div>
                    </div>
                    <Pagination></Pagination>
                </div>
            </section>
        </>
    );
};

export default ProductsAdmin;
