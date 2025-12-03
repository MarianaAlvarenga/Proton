import React, { useState, useEffect } from "react";
import OkButton from "../common/OkButton";
import CancelButton from "../common/CancelButton";
import { useNavigate, useParams } from "react-router-dom";
import ProductImage from "./ProductImage";
import axios from "axios";

const ProductCreateForm = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState(null);
    const [formData, setFormData] = useState({
        nombre_producto: "",
        descripcion_producto: "",
        stock_producto: "",
        punto_reposicion: "",
        categoria_id_categoria: "",
        precio_producto: "",
        codigo_producto: productId || "",
    });

    useEffect(() => {
        axios.get('https://cabinet-rights-enrollment-searching.trycloudflare.com/backend/actions/getCategories.php')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error("Hubo un error al obtener las categorías:", error);
            });

        if (productId) {
            axios.get(`https://cabinet-rights-enrollment-searching.trycloudflare.com/backend/actions/getProducts.php?id=${productId}`)
                .then(response => {
                    const product = response.data;
                    if (product) {
                        setFormData({
                            nombre_producto: product.nombre_producto,
                            descripcion_producto: product.descripcion_producto,
                            stock_producto: product.stock_producto,
                            punto_reposicion: product.punto_reposicion,
                            categoria_id_categoria: product.categoria_id_categoria,
                            precio_producto: product.precio_producto,
                            codigo_producto: product.id,
                        });
                        setImage(product.image_url);
                    }
                })
                .catch(error => {
                    console.error("Hubo un error al obtener el producto:", error);
                    alert("No se pudo cargar el producto para editar.");
                });
        }
    }, [productId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (file) => {
        setImage(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('codigo_producto', formData.codigo_producto);
        data.append('nombre_producto', formData.nombre_producto);
        data.append('descripcion_producto', formData.descripcion_producto);
        data.append('stock_producto', formData.stock_producto);
        data.append('punto_reposicion', formData.punto_reposicion);
        data.append('categoria_id_categoria', formData.categoria_id_categoria);
        data.append('precio_producto', formData.precio_producto);

        if (image) {
            data.append('image_url', image);
        }

        try {
            let response;
            if (productId) {
                response = await axios.post(
                    'https://cabinet-rights-enrollment-searching.trycloudflare.com/backend/actions/updateProduct.php',
                    data,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    }
                );
            } else {
                response = await axios.post(
                    'https://cabinet-rights-enrollment-searching.trycloudflare.com/backend/actions/addProduct.php',
                    data,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    }
                );
            }

            if (response.data.success) {
                alert(productId ? "Producto actualizado exitosamente" : "Producto creado exitosamente");
                navigate('/products');
            } else {
                alert("Error al " + (productId ? "actualizar" : "crear") + " el producto: " + response.data.message);
            }
        } catch (error) {
            console.error("Hubo un error al " + (productId ? "actualizar" : "crear") + " el producto:", error);
            alert("No se pudo " + (productId ? "actualizar" : "crear") + " el producto. Intenta nuevamente.");
        }
    };

    const handleCancel = () => {
        navigate('/products');
    };

    return (
        <div className="container" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <ProductImage onImageUpload={handleFileChange} imageUrl={image} />
            <div className="box">
                <form onSubmit={handleSubmit}>
                    <input
                        type="hidden"
                        name="codigo_producto"
                        value={formData.codigo_producto}
                    />

                    {/* CATEGORÍA */}
                    <div className="field">
                        <label className="label">Categoría</label>
                        <div className="control">
                            <div className="select is-fullwidth">
                                <select
                                    name="categoria_id_categoria"
                                    value={formData.categoria_id_categoria}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccionar categoría</option>
                                    {categories.map((category) => (
                                        <option key={category.id_categoria} value={category.id_categoria}>
                                            {category.nombre_categoria}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Nombre del producto</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                name="nombre_producto"
                                value={formData.nombre_producto}
                                onChange={handleChange}
                                placeholder="Producto1"
                                required
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Descripción del producto</label>
                        <div className="control">
                            <textarea
                                className="textarea is-small"
                                name="descripcion_producto"
                                value={formData.descripcion_producto}
                                onChange={handleChange}
                                placeholder="Este producto es el mejor"
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Stock</label>
                        <div className="control">
                            <input
                                className="input"
                                type="number"
                                name="stock_producto"
                                value={formData.stock_producto}
                                onChange={handleChange}
                                placeholder="1500"
                                required
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Precio</label>
                        <div className="control">
                            <input
                                className="input"
                                type="number"
                                name="precio_producto"
                                value={formData.precio_producto}
                                onChange={handleChange}
                                placeholder="200"
                                required
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Punto de reposición</label>
                        <div className="control">
                            <input
                                className="input"
                                type="number"
                                name="punto_reposicion"
                                value={formData.punto_reposicion}
                                onChange={handleChange}
                                placeholder="200"
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <CancelButton onClick={handleCancel} />
                        <OkButton NameButton={productId ? "Actualizar" : "Agregar"} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductCreateForm;
