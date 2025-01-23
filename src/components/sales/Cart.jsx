import React from "react";
import NavBar from "../common/NavBar";
import SubNavBar from "../common/SubNavBar";
import ProductImage from "../../components/sales/ProductCard";
import Pagination from "../common/Pagination";
import CancelButton from "../common/CancelButton";

import "./Cart.css";

const Cart = () => {
    return(
        <>
            <div className="page-wrapper">
                <section className="section" style={{ margin: "0px" }}>
                    <NavBar showSearch showMenu/>
                    <SubNavBar showBack showCart currentPage="Productos"/>
                    <div className="ButtonsPanel">
                        <div>TOTAL: </div>
                        <CancelButton className='button' NameButton="Seguir comprando"></CancelButton>
                    </div>
                    <div className="products-container-wrapper">
                        <div className="products-container">
                            <div className="product-card">
                                <ProductImage ShowCount/>
                            </div>
                            <div className="product-card">
                                <ProductImage ShowCount/>
                            </div>
                            <div className="product-card">
                                <ProductImage ShowCount/>
                            </div>
                            <div className="product-card">
                                <ProductImage ShowCount/>
                            </div>
                            <div className="product-card">
                                <ProductImage ShowCount/>
                            </div>
                            <div className="product-card">
                                <ProductImage ShowCount/>
                            </div>
                            <div className="product-card">
                                <ProductImage ShowCount/>
                            </div>
                            <div className="product-card">
                                <ProductImage ShowCount/>
                            </div>
                        </div>  
                    </div>
                    <div className="ButtonsPanel">
                        <CancelButton className='button' NameButton="Cancelar"></CancelButton> 
                        <CancelButton className='button' NameButton="Finalizar compra"></CancelButton>
                    </div>
                    <div className="pagination-container">
                        <Pagination/>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Cart;
