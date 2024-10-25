import react from 'react';
import './Login.css'
const Login = () => {
   return (
        <div className="container" style={{ maxWidth: '400px', marginTop: '50px', textAlign: 'center' }}>
          <div className="box" style={{ backgroundColor: '#D9D0F0', borderRadius: '10px' }}>
            <figure className="image is-128x128 is-inline-block">
                <img class="is-rounded" src={require('../assets/images/protiblanco.png')} style={{ margin: '0 auto' }}/>
            </figure>
            <h1 className="title is-3">Ingreso</h1>
    
            <form onSubmit="#" style={{textAlign: 'left'}}>
              <div className="field" >
                   <label className="label">Usuario</label>
                   <div className="control">
                     <input className="input" type="text" placeholder="CosmeFulanito" value=""/>
                   </div>
               </div>
    
               <div className="field">
                   <label className="label">Contraseña</label>
                   <div className="control">
                      <input className="input" type="password" placeholder="XXXXXXXXX" value= ""/>
                      </div>
                      <p className="help"> <a href="#">Olvidé mi contraseña</a> </p>
              </div>
    
              <div className="field">
                <button className="button is-fullwidth" style={{ backgroundColor: '#6A0DAD', color: 'white' }}>
                  Ingresar
                </button>
              </div>
            </form>
    
            <div className="social-login m-3">
              <div className="buttons is-centered">
                <button className="">
                  <span className="icon">
                    <i className="fab fa-google"><img src={require('../assets/images/cromo.png')} alt="chrome" /></i>
                  </span>
                </button>
                <button className="">
                  <span className="icon">
                    <i className="fab fa-facebook"><img src={require('../assets/images/facebook.png')} alt="facebook" /></i>
                  </span>
                </button>
                <button className="">
                  <span className="icon">
                    <i className="fab fa-instagram"><img src={require('../assets/images/instagram.png')} alt="instargram" /></i>
                  </span>
                </button>
              </div>
            </div>
    
            <p className="has-text-centered"> Si no tenés cuenta, <a href="#">Regístrate</a></p>
          </div>
        </div>
      );
};
export default Login;