import React, { useState, useEffect } from "react";
//import './ProductCreateForm.css';
import OkButton from "../common/OkButton";
import CancelButton from "../common/CancelButton";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductCreateForm = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]); // Estado para categorías
    const [formData, setFormData] = useState({
        nombre: "",
        precio: "",
        reposicion: "",
        stock: "",
        descripcion: "",
        categoria_id: "",
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value }); // Actualizar estado del formulario
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir recarga de la página
        try {
            const response = await axios.post('http://localhost:8080/Proton/backend/actions/addProduct.php', formData);
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
            <div className="box" style={{ paddingTop: '0px', paddingBottom: '0px' }}>
                <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                    {/* Dropdown de categorías */}
                    <div className="field">
                        <label className="label">Categoría</label>
                        <div className="select" style={{ width: '100%' }}>
                            <select
                                name="categoria_id"
                                value={formData.categoria_id}
                                onChange={handleChange}
                                style={{ width: '100%' }}
                                required
                            >
                                <option value="">Seleccionar categoría</option>
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.nombre_categoria}
                                        </option>
                                    ))
                                ) : (
                                    <option>Cargando...</option>
                                )}
                            </select>
                        </div>
                    </div>

                    {/* Resto del formulario */}
                    <div className="field">
                        <label className="label">Nombre</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Producto1"
                                required
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Precio de venta</label>
                        <div className="control">
                            <input
                                className="input"
                                type="number"
                                name="precio"
                                value={formData.precio}
                                onChange={handleChange}
                                placeholder="$00.00"
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
                                name="reposicion"
                                value={formData.reposicion}
                                onChange={handleChange}
                                placeholder="200"
                                required
                            />
                        </div>        
                    </div>

                    <div className="field">
                        <label className="label">Stock</label>
                        <div className="control">
                            <input
                                className="input"
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="1500"
                                required
                            />
                        </div>        
                    </div>

                    <div className="field">
                        <label className="label">Descripción</label>
                        <div className="control">
                            <textarea
                                className="textarea is-small"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                placeholder="Este producto es el mejor"
                                required
                            />
                        </div>        
                    </div>

                    <div style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <CancelButton></CancelButton>
                        <OkButton NameButton="Agregar"></OkButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductCreateForm;
