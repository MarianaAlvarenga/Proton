# TODO LIST

* Armar archivos css
* Componentizar el menu

# VENTANAS DE FRONT A CREAR
**En comun**
 * Login ✔️
 * Registro ✔️
 * Carrito

**ADMIN**
 * Menu admin ✔️
 * Mostrar productos admin ✔️
 * Modificar/Eliminar productos ✔️  
 * Modificar producto ❌(no trae los datos del producto de la base y no actualiza correctamente a pesar del msj de éxito.)
 * Faltan categorias ✔️
 * Vista inicial de turnos ✔️
 * Sign up con combo de roles ✔️
 * Boton de realizar compra en la vista de ventas. ✔️
 * Realizar compra debe llevar a la página del carrito (cuando se toque el botón "+").
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
 * En Shifts falta front para asignar el turno a un cliente (lista de usuarios - buscador)
 * Agregar pie de pagina 
 * Vista turno confirmado
 
 **Cliente**
 * Menu del cliente ✔️
 * Vista de turnos del cliente ✔️
 * Vista de ventas del cliente ✔️
 * Faltan categorias ✔️
 * Agregar productos al carrito
 * Eliminar productos del carrito
 * Ver/modificar perfil
 * Historial de compras
 * Vista historial de turnos
 * Ver bonos
 * Modificar desplegable en "Ventas". Hay que sacar "Agregar producto", "Realizar compra" y "Realizar edición".
 


 **Peluquero**
 * Menu peluquero ✔️
 * Ingreso disponibilidad ✔️
 * Vista calendario con turnos ya asignados
 * Sacar turno
 * Ingresar cliente como atendido (permitir ingresar detalles de la atencion para el historial)

 **Vendedor**
* Menu vendedor ✔️
* Ingreso a gestor de turnos
* Modificar/cancelar turno
* Ingreso a gestor de ventas
* Permitir ventas sin cliente registrado.
* Permitir registrar a clientes.
* Venta de productos.

 **General**
* Agregar input para el buscador.
* Menu hamburguesa.
* Texto en el subnav que indique la seccion actual.
* Agregar cerrar sesion
* ajustar tamaño de imagenes que se suben en Products.jsx
* Responsive
* Menu desplegable

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
