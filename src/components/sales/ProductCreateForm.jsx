import React, { useState, useEffect } from "react";
import OkButton from "../common/OkButton";
import CancelButton from "../common/CancelButton";
import { useNavigate, useParams } from "react-router-dom";
import ProductImage from "./ProductImage";
import axios from "axios";

const ProductCreateForm = () => {
    const navigate = useNavigate();
    const { productId } = useParams(); // Obtener el ID del producto desde la URL
    const [categories, setCategories] = useState([]); // Estado para categorías
    const [image, setImage] = useState(null); // Estado para la imagen
    const [formData, setFormData] = useState({
        nombre_producto: "",
        descripcion_producto: "",
        stock_producto: "",
        punto_reposicion: "",
        categoria_id_categoria: "",
        precio_producto: "",
        codigo_producto: productId || "", // Inicializar con el ID del producto si existe
    });

    // Obtener categorías y datos del producto (si se está editando)
    useEffect(() => {
        // Obtener categorías desde el backend
        axios.get('http://localhost:8080/Proton/backend/actions/getCategories.php')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error("Hubo un error al obtener las categorías:", error);
            });

        // Si estamos editando un producto, obtener sus datos
        if (productId) {
            axios.get(`http://localhost:8080/Proton/backend/actions/getProducts.php?id=${productId}`)
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
                            codigo_producto: product.id, // Asignar el valor de "id" a "codigo_producto"
                        });
                    }
                })
                .catch(error => {
                    console.error("Hubo un error al obtener el producto:", error);
                    alert("No se pudo cargar el producto para editar.");
                });
        }
    }, [productId]);

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Manejar cambios en la imagen
    const handleFileChange = (file) => {
        setImage(file);
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir recarga de la página

        // Crear un objeto FormData para enviar los datos
        const data = new FormData();
        data.append('codigo_producto', formData.codigo_producto);
        data.append('nombre_producto', formData.nombre_producto);
        data.append('descripcion_producto', formData.descripcion_producto);
        data.append('stock_producto', formData.stock_producto);
        data.append('punto_reposicion', formData.punto_reposicion);
        data.append('categoria_id_categoria', formData.categoria_id_categoria);
        data.append('precio_producto', formData.precio_producto);

        // Agregar la imagen si está presente
        if (image) {
            data.append('image_url', image);
        }

        try {
            let response;

            // Si hay productId, estamos actualizando el producto, sino lo estamos creando
            if (productId) {
                response = await axios.post(
                    'http://localhost:8080/Proton/backend/actions/updateProduct.php',
                    data,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    }
                );
            } else {
                response = await axios.post(
                    'http://localhost:8080/Proton/backend/actions/addProduct.php',
                    data,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    }
                );
            }

            if (response.data.success) {
                alert(productId ? "Producto actualizado exitosamente" : "Producto creado exitosamente");
                navigate('/products'); // Redirigir a la página de productos
            } else {
                alert("Error al " + (productId ? "actualizar" : "crear") + " el producto: " + response.data.message);
            }
        } catch (error) {
            console.error("Hubo un error al " + (productId ? "actualizar" : "crear") + " el producto:", error);
            alert("No se pudo " + (productId ? "actualizar" : "crear") + " el producto. Intenta nuevamente.");
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <ProductImage onImageUpload={handleFileChange} />
            <div className="box">
                <form onSubmit={handleSubmit}>
                    {/* Campo oculto para el código del producto */}
                    <input
                        type="hidden"
                        name="codigo_producto"
                        value={formData.codigo_producto}
                    />

                    {/* Campo: Categoría */}
                    <div className="field">
                        <label className="label">Categoría</label>
                        <div className="select" style={{ width: '100%' }}>
                            <select
                                name="categoria_id_categoria"
                                value={formData.categoria_id_categoria}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccionar categoría</option>
                                {categories.map(category => (
                                    <option key={category.id_categoria} value={category.id_categoria}>
                                        {category.nombre_categoria}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Campo: Nombre del producto */}
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

                    {/* Campo: Código del producto (solo lectura) */}
                    <div className="field">
                        <label className="label">Código de Producto</label>
                        <div className="control">
                            <input
                                className="input"
                                type="number"
                                name="codigo_producto"
                                value={formData.codigo_producto || ""} // Mostrar el valor real del producto
                                onChange={handleChange} // Aunque sea de solo lectura, es necesario para React
                                readOnly // Hacer el campo de solo lectura
                            />
                        </div>
                    </div>

                    {/* Campo: Descripción del producto */}
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

                    {/* Campo: Stock del producto */}
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

                    {/* Campo: Precio del producto */}
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

                    {/* Campo: Punto de reposición */}
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

                    {/* Botones */}
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <CancelButton onClick={() => navigate('/products')} />
                        <OkButton NameButton={productId ? "Actualizar" : "Agregar"} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductCreateForm;
