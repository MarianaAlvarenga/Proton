import React, { useState, useEffect } from "react";
import OkButton from "../common/OkButton";
import CancelButton from "../common/CancelButton";
import { useNavigate, useParams } from "react-router-dom";
import ProductImage from "./ProductImage";
import axios from "axios";
import Alert from "../common/Alert"; // 👈 agregado

const ProductCreateForm = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

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
        axios.get('https://annotation-tue-static-inc.trycloudflare.com/backend/actions/getCategories.php')
            .then(response => setCategories(response.data))
            .catch(error => console.error("Hubo un error al obtener las categorías:", error));

        if (productId) {
            axios.get(`https://annotation-tue-static-inc.trycloudflare.com/backend/actions/getProducts.php?id=${productId}`)
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
                        setPreview(product.image_url);
                    }
                })
                .catch(async (error) => {
                    console.error("Hubo un error al obtener el producto:", error);
                    await Alert({
                        Title: "Error",
                        Detail: "No se pudo cargar el producto para editar.",
                        icon: "error",
                        Confirm: "Aceptar"
                    });
                });
        }
    }, [productId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (file) => {
        setImage(file);
        setPreview(URL.createObjectURL(file));
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

        if (image instanceof File) {
            data.append('image_url', image);
        } else {
            data.append('keep_image', formData.codigo_producto);
        }

        try {
            let response;
            if (productId) {
                response = await axios.post(
                    'https://annotation-tue-static-inc.trycloudflare.com/backend/actions/updateProduct.php',
                    data,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
            } else {
                response = await axios.post(
                    'https://annotation-tue-static-inc.trycloudflare.com/backend/actions/addProduct.php',
                    data,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
            }

            if (response.data.success) {
                await Alert({
                    Title: "Perfecto",
                    Detail: productId ? "Producto actualizado exitosamente" : "Producto creado exitosamente",
                    icon: "success",
                    Confirm: "Ok"
                });
                navigate('/products');
            } else {
                await Alert({
                    Title: "Error",
                    Detail: response.data.message,
                    icon: "error",
                    Confirm: "Aceptar"
                });
            }
        } catch (error) {
            console.error("Error:", error);
            await Alert({
                Title: "Error",
                Detail: "No se pudo completar la acción.",
                icon: "error",
                Confirm: "Aceptar"
            });
        }
    };

    const handleCancel = async () => {
        const result = await Alert({
            Title: "¿Seguro que querés cancelar?",
            Detail: "Los cambios no se guardarán.",
            icon: "warning",
            Confirm: "Sí, salir",
            Cancel: "No, volver",
        });

        if (result?.isConfirmed) {
            navigate('/products');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <ProductImage onImageUpload={handleFileChange} imageUrl={preview} />

            <div className="box">
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="codigo_producto" value={formData.codigo_producto} />

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
