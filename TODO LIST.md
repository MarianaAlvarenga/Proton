cambio de lugar botones para agregar y editar usuarios.✔️
cambio de lugar botones para agregar mascotas.✔️
fecha de nacimiento nulleable en actualización de usuario.✔️
cuando se agrega un usuario desde administrador y se elije una imágen, esa foto no se muestra en el perfil de dicho usuario.✔️
"cancelar" de modal para eliminar usuario no hace nada✔️
administradores/vendedores/peluqueros no deben tener mascotas asociadas.✔️
en "perfil" de peluquero, en "Especialidades" aparecen "Especialidad" en lugar del nombre de la especialidad✔️
cuando se edita peluquero siendo administrador debe completar checkbox de especialidades con las que tenga asociadas.✔️
no se puede editar la foto cuando se edita un usuario desde admin.✔️
((((para commitear 
----------------------------------------------------------------
botón "eliminar mascota" ?
no actualiza foto de perfil en editar usuario

"mascota agregada correctamente" --> tiene que ser con modal.
# TODO LIST

* Armar archivos css
* Componentizar el menu

# VENTANAS DE FRONT A CREAR
**En comun**
 * Login ✔️
 * Registro ✔️
 * Carrito ✔️

**ADMIN**
 * Menu admin ✔️
 * Mostrar productos admin ✔️
 * Modificar/Eliminar productos ✔️  
 * Modificar producto ❌(no trae los datos del producto de la base y no actualiza correctamente a pesar del msj de éxito.) ✔️
 * Faltan categorias ✔️
 * Vista inicial de turnos ✔️
 * Sign up con combo de roles ✔️
 * Boton de realizar compra en la vista de ventas. ✔️
 * Realizar compra debe llevar a la página del carrito (cuando se toque el botón "+").✔️
 * Agregar precio a la card de producto. ✔️
 * Boton de agregar producto fuera de la card. ✔️
 * Pedido de datos del cliente desde el admin ✔️
 * Popup✔️
 * Vista inicial Usuarios ✔️
 * Alta usuario ✔️
 * Baja/Modificacion usuario ✔️
 * Modificar turno
 * Cancelar turno
 * Agregar datos de mascota
 * En Shifts falta front para asignar el turno a un cliente (lista de usuarios - buscador) ❓❓❓
 * Agregar pie de pagina 
 * Vista turno confirmado ❓❓❓
 * Modificar el menu hamburguesa, una vez en la pantalla de la opcion seleccionada, esa opcion tiene que inhabilitarse.
 * 
 
 **Cliente**
 * Menu del cliente ✔️
 * Vista de turnos del cliente ✔️
 * Vista de ventas del cliente ✔️
 * Faltan categorias ✔️
 * Agregar productos al carrito ✔️
 * Eliminar productos del carrito ✔️
 * El total del carrito no se actualiza
 * Ver/modificar perfil
 * Historial de compras ❓❓❓
 * Vista historial de turnos ❓❓❓
 * Ver bonos ❓❓❓
 * Modificar desplegable en "Ventas". Hay que sacar "Agregar producto", "Realizar compra" y "Realizar edición".✔️
 * No se tiene que poder modificar el año en el que se quiere sacar el turno.
 * Poder elegir la fecha de turno entre los disponibles.
 * El carrito esta bien raro (front-end)
 * Cambiar el menu hamburguesa en el home.
 * Cuando hay pocos productos en la pantalla, no se ven todas las opciones del menu hamburguesa.
 * El sacar un turno desde el cliente no deberia pedir el mail, ya que no va a sacar el cliente un turno para otra persona.
 * Reubicar botones "Aceptar", "Cancelar", etc en todas las pantallas.



 **Peluquero**
 * Menu peluquero ✔️
 * Ingreso disponibilidad ✔️
 * Vista calendario con turnos ya asignados
 * Sacar turno
 * Ingresar cliente como atendido (permitir ingresar detalles de la atencion para el historial)
 * Al seleccionar la disponibilidad, que en el horario se pueda escribir el numero, no solamente subir y bajar con los + y -.


 **Vendedor**
* Menu vendedor ✔️
* Ingreso a gestor de ventas ❓❓❓
* Permitir ventas sin cliente registrado. ✔️
* Permitir registrar a clientes (landing page)
* Venta de productos. ❓❓❓

 **General**
* Agregar cerrar sesion ✔️
* ajustar tamaño de imagenes que se suben en Products.jsx
* Responsive
* Menu desplegable
* Hacer algo con los mensajes de sistema. Por ejemplo al modificar un usuario sin seleccionar ninguno, aparece un mensaje super feo.
* Agregar un mensaje de si se esta seguro de cerrar sesión.
* Quitar mascotas asociadas de peluqueros, administradores y vendedores.

* VINCULAR BD DE ORACLE


**----------------------BACKEND-----------------------------**

* Darle funcionalidad a los botones de redes

# Cosas para cambiar del modo editar-usuario siendo admin #

* Rol: (nombre de rol en lugar de nro.)✔️
* Teléfono: Agregar el campo✔️
* Botón: Actualizar en lugar de Registrarse✔️


En UserSaleInfo.jsx hay que sacar el desplegable. hay que cambiar el campo "nombre" por el de "email". 
hay que sacar el campo "dni".
en el alta de cliente SignUp.jsx se debe agregar la fecha de nacimiento, ya que en la tabla "cliente" 
tenemos el campo "fecha_nac" (el cual también se podría agregar al UserSaleInfo.jsx como una comprobación adicional. 
{email y fecha de nacimiento}). 
dentro de la tabla "cliente" también se encuentra el campo "vendedor_id_usuario", 
el cual asumo que es para poner el id del vendedor/administrador que realiza la venta.

# VALIDACIÓN DE MAIL EN COMPRA DE USUARIO REGISTRADO.
# BUSCADOR DE USUARIOS

# ~·~·~ LO QUE FALTA ~·~·~ #
* ADMINISTRADOR -VENTAS- (alta, edición y eliminación de producto):
    ALTA DE PRODUCTO: No debe poderse ingresar el código del producto manualmente. este campo no debe figurar en el formulario de alta de producto, y se debe agregar a la base de datos autoincrementalmente.

* ADMINISTRADOR-VENTAS- (compra de producto):
    FINALIZAR COMPRA: Al tildar el checkbox de "usuario no registrado" se guarda bien en la bd en la tabla "usuario no registrado" pero en la de "carrito" solo se guarda el dato en la columna "usuario no registrado" y también debería guardarse en la columna correspondiente al id que hace la compra.✔️
    Al tildar el checkbo de "usuario registrado" tiene que validarse el email como dirección valida y aparte compararse con la de la base. si hay coincidencia NO debe registrarse el id en la columna "usuario no registrado" y si se debe registrar en la columna del "id_cliente" y aparte en la del rol que realiza la compra.✔️
    
* ADMINISTRADOR-TURNOS-:
    SELECCIONAR TURNO: al "guardar y cerrar" debe

* PELUQUERO-DISPONIBILIDAD-:
    Al tocar el botón se debe abrir el calendario y permitir elegir la disponibilidad (por mes).
* PELUQUERO-AGENDAR TURNO-:
    Al tocar el botón se debe abrir el calendario pudiendo visualizar con un color los turnos disponibles y pudiendo seleccionar alguno para agendarlo.

* VENDEDOR-ECOMMERCE:
    No debe aparecer la opción de "realizar edición" en el desplegable.✔️
    No debe poder agregar productos.✔️
    
    FINALIZAR COMPRA: Al tildar el checkbox de "usuario no registrado" se guarda bien en la bd en la tabla "usuario no registrado" pero en la de "carrito" solo se guarda el dato en la columna "usuario no registrado" y también debería guardarse en la columna correspondiente al id que hace la compra.✔️
    Al tildar el checkbo de "usuario registrado" tiene que validarse el email como dirección valida y aparte compararse con la de la base. si hay coincidencia NO debe registrarse el id en la columna "usuario no registrado" y si se debe registrar en la columna del "id_cliente" y aparte en la del rol que realiza la compra.✔️

- SACAR CAMPO "CODIGO PRODUCTO" EN ALTA DE PRODUCTO✔️
- ARREGLAR SCRIPT DE BD. (antes agregar el autoincrement en el código de producto de la bd y cambiar el tipo y el tamaño del precio del producto -FLOAT de 7.2-) ✔️
- UNIFICAR CONEXIÓN A BD en todos los archivos de back.✔️
- Modificar alerts, por ejemplo: "Producto agregado exitosamente"
- Vinculación con mercadopago
- Subir bd a la nube
- AGREGAR CONFIRMACIÓN PARA CERRAR SESIÓN (componente Alert.jsx)
- MODIFICAR SIGNUP DE PELUQUERO (cuando el admin seleccione el rol "peluquero" se debe mostrar otro combobox con las especialidades)
- AGREGAR COLUMNAS "DISPONIBILIDAD" (de turnos) y ID_TURNO (foránea de turno) EN TABLA PELUQUERO
- MODIFICAR ESTILOS DE BOTON DE CERRAR SESIÓN PA QUE CUANDO SE HAGA HOVER BRILLE 


EL BOTON CANCELAR EN "AGREGAR PRODUCTO" DESDE ADMIN, AGREGA UN PRODUCTO EN LUGAR DE CANCELAR
EN "REGISTRAR USUARIO" Y EN "EDITAR USUARIO" debe haber botones de "cancelar" para evitar usar el backbutton.

                    



EN EL PROFILE USER, REVISAR ESTA PAGINA:
https://bulma.io/documentation/form/general/

**Contiene herramientas para la validacion** Ejemplo: "is-success" para los input

FALTA TRAER LA CONTRASEÑA DE LA BD EN ProfileUser

