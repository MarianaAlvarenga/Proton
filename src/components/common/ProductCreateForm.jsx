import React from "react";
// COMPONENTIZAR BOTON**************
// SEPARAR CSS**********************
const ProductCreateForm = () => {
    return(
        <div className="container" style={{ maxWidth: '400px',  textAlign: 'center' }}>
            <div className="box" style={{ paddingTop:'0px', paddingBottom:'0px' }}>
                <form onSubmit="#" style={{textAlign: 'left'}}>

                    <div className="field" >
                        <label className="label">Categoría</label>
                        <div class="select" style={{ width: '100%' }}>
                            <select style={{ width: '100%', color: '#333' }}>
                                <option style={{ width: '100%', backgroundColor:'white' }}>Select dropdown</option>
                                <option>With options</option>
                            </select>
                        </div>
                    </div>

                    <div className="field" >
                        <label className="label">Nombre</label>
                        <div className="control">
                        <input className="input" type="text" placeholder="Producto1" value=""/>
                        </div>
                    </div>

                    <div className="field">
                        <label className="label">Precio de venta</label>
                        <div className="control">
                            <input className="input" type="number" placeholder="$00.00" value= ""/>
                        </div>        
                    </div>

                    <div className="field">
                        <label className="label">Punto de reposición</label>
                        <div className="control">
                            <input className="input" type="number" placeholder="200" value= ""/>
                        </div>        
                    </div>

                    <div className="field">
                        <label className="label">Stock</label>
                        <div className="control">
                            <input className="input" type="number" placeholder="1500" value= ""/>
                        </div>        
                    </div>

                    <div className="field">
                        <label className="label">Descripción</label>
                        <div className="control">
                            <textarea className="textarea is-small" placeholder="Este producto es el mejor"></textarea>
                        </div>        
                    </div>
                
                    <div className="field">
                    <button className="button is-fullwidth" style={{ backgroundColor: '#6A0DAD', color: 'white' }}>
                        Agregar
                    </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductCreateForm;