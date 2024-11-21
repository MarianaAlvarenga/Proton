import React, { useState, useEffect } from "react";
import './ProductCreateForm.css';
import OkButton from "../common/OkButton";
import CancelButton from "../common/CancelButton";
import { useNavigate } from "react-router-dom";
import axios from "axios";  // Importar axios

const ProductCreateForm = () => {
    const navigate = useNavigate();

    // Estado para almacenar las categorías
    const [categories, setCategories] = useState([]);

    // Obtener categorías al cargar el componente
    useEffect(() => {
        axios.get('http://localhost:8080/Proton/backend/actions/getCategories.php')  // Ruta del archivo PHP en tu servidor
            .then(response => {
                setCategories(response.data);  // Almacenar las categorías en el estado
            })
            .catch(error => {
                console.error("Hubo un error al obtener las categorías:", error);
            });
    }, []);  // Este efecto se ejecuta solo una vez cuando el componente se monta

    return (
        <div className="container" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div className="box" style={{ paddingTop: '0px', paddingBottom: '0px' }}>
                <form onSubmit="#" style={{ textAlign: 'left' }}>

                    {/* Dropdown de categorías */}
                    <div className="field">
                        <label className="label">Categoría</label>
                        <div className="select" style={{ width: '100%' }}>
                            <select style={{ width: '100%' }}>
                                {/* Renderizar las categorías obtenidas de la API */}
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.nombre_categoria}
                                        </option>
                                    ))
                                ) : (
                                    <option>Loading...</option>
                                )}
                            </select>
                        </div>
                    </div>

                    {/* Resto del formulario */}
                    <div className="field">
                        <label className="label">Nombre</label>
                        <div className="control">
                            <input className="input" type="text" placeholder="Producto1" />
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Precio de venta</label>
                        <div className="control">
                            <input className="input" type="number" placeholder="$00.00" />
                        </div>        
                    </div>

                    <div className="field">
                        <label className="label">Punto de reposición</label>
                        <div className="control">
                            <input className="input" type="number" placeholder="200" />
                        </div>        
                    </div>

                    <div className="field">
                        <label className="label">Stock</label>
                        <div className="control">
                            <input className="input" type="number" placeholder="1500" />
                        </div>        
                    </div>

                    <div className="field">
                        <label className="label">Descripción</label>
                        <div className="control">
                            <textarea className="textarea is-small" placeholder="Este producto es el mejor"></textarea>
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
}

export default ProductCreateForm;
