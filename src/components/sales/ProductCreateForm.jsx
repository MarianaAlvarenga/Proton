import React, { useState, useEffect } from "react";
import './ProductCreateForm.css';
import OkButton from "../common/OkButton";
import CancelButton from "../common/CancelButton";
import { useNavigate } from "react-router-dom";
import ProductImage from "./ProductImage";
import axios from "axios";

const ProductCreateForm = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]); // Estado para categorías
    const [image, setImage] = useState(null); // Estado para imagen
    const [formData, setFormData] = useState({
        nombre_producto: "",
        descripcion_producto: "",
        stock_producto: "",
        punto_reposicion: "",
        categoria_id_categoria: "",
        precio_producto: "",
        codigo_producto: "",
    }); // Estado para el formulario

    useEffect(() => {
        // Obtener categorías desde el backend
        axios.get('http://localhost:8080/Proton/backend/actions/getCategories.php')
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error("Hubo un error al obtener las categorías:", error);
            });
    }, []);

    // Maneja los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Maneja los cambios en el campo de imagen
    const handleFileChange = (file) => {
        setImage(file);
        console.log('Imagen seleccionada:', file);
    };

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir recarga de la página
        const data = new FormData();
        data.append('nombre_producto', formData.nombre_producto);
        data.append('descripcion_producto', formData.descripcion_producto);
        data.append('stock_producto', formData.stock_producto);
        data.append('punto_reposicion', formData.punto_reposicion);
        data.append('categoria_id_categoria', formData.categoria_id_categoria);
        data.append('precio_producto', formData.precio_producto);
        data.append('codigo_producto', formData.codigo_producto);
        // Agregar la imagen
        if (image) {
            data.append('image_url', image); // Asegúrate de que el campo coincida con el backend
        }

        console.log("FormData:", data); // Ver los datos enviados

        try {
            const response = await axios.post('http://localhost:8080/Proton/backend/actions/addProduct.php', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.data.success) {
                alert("Producto agregado exitosamente");
                navigate('/products'); // Redirigir después de agregar
            } else {
                alert("Error al agregar el producto: " + response.data.message);
            }
        } catch (error) {
            console.error("Hubo un error al agregar el producto:", error);
            alert("No se pudo agregar el producto. Intenta nuevamente.");
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', textAlign: 'center' }}>

            <ProductImage onImageUpload={handleFileChange} />
            <div className="box">
                <form onSubmit={handleSubmit}>
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
                                      {/* Nombre del producto */}
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

                                        {/* Codigo del producto */}
                    <div className="field">
                        <label className="label">Codigo de Producto</label>
                        <div className="control">
                            <input
                                className="input"
                                type="number"
                                name="codigo_producto"
                                value={formData.codigo_producto}
                                onChange={handleChange}
                                placeholder="1500"
                                required
                            />
                        </div>
                    </div>

                    {/* Descripción del producto */}
                    <div className="field">
                        <label className="label">Descripción del producto</label>
                        <div className="control">
                            <textarea
                                className="textarea is-small"
                                name="descripcion_producto"
                                value={formData.descripcion_producto}
                                onChange={handleChange}
                                placeholder="Este producto es el mejor"
                                required
                            />
                        </div>
                    </div>

                    {/* Stock del producto */}
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
                    
                    {/* Punto de reposición */}
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
                    
                    {/* Punto de reposición */}
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
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}>
                        <CancelButton />
                        <OkButton NameButton="Agregar" />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductCreateForm;
