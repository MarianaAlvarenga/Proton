CREATE DATABASE proton;

USE proton;

CREATE TABLE bono (
 id_bono INT NOT NULL AUTO_INCREMENT,
 porcentaje_descuento TINYINT,
 cliente_vendedor_id_usuario INT NOT NULL,
 PRIMARY KEY (id_bono)
);

CREATE TABLE carrito (
 id_carrito INT NOT NULL AUTO_INCREMENT,
 fecha_carrito DATE NOT NULL,
 hora_carrito TIME NOT NULL,
 cliente_id_usuario1 INT,
 vendedor_id_usuario INT,
 administrador_id_usuario INT,
 PRIMARY KEY (id_carrito)
);

CREATE TABLE categoria (
 id_categoria INT NOT NULL AUTO_INCREMENT,
 nombre_categoria VARCHAR(30) NOT NULL,
 PRIMARY KEY (id_categoria)
);

CREATE TABLE es_ofrecido (
 peluquero_id_usuario INT NOT NULL,
 servicio_id_servicio INT NOT NULL,
 PRIMARY KEY (peluquero_id_usuario, servicio_id_servicio)
);

CREATE TABLE horas_disponibles (
 id_horario_disponible INT NOT NULL AUTO_INCREMENT,
 hora_inicial TIME NOT NULL,
 hora_final TIME NOT NULL,
 PRIMARY KEY (id_horario_disponible)
);

CREATE TABLE mascota (
 id_mascota INT NOT NULL AUTO_INCREMENT,
 nombre_mascota VARCHAR(30) NOT NULL,
 fecha_nacimiento DATE NOT NULL,
 raza VARCHAR(20) NOT NULL,
 peso FLOAT(5, 2),
 tamanio VARCHAR(20) NOT NULL,
 largo_pelo VARCHAR(20),
 cliente_vendedor_id_usuario INT NOT NULL,
 PRIMARY KEY (id_mascota)
);

CREATE TABLE producto (
 codigo_producto INT NOT NULL,
 nombre_producto VARCHAR(30) NOT NULL,
 descripcion_producto VARCHAR(50),
 stock_producto INT NOT NULL,
 punto_reposicion INT,
 categoria_id_categoria INT NOT NULL,
 PRIMARY KEY (codigo_producto)
);

CREATE TABLE realiza (
 cliente_id_usuario INT NOT NULL,
 recomendacion_id_recomendacion INT NOT NULL,
 PRIMARY KEY (cliente_id_usuario, recomendacion_id_recomendacion)
);

CREATE TABLE recomendacion (
 id_recomendacion INT NOT NULL AUTO_INCREMENT,
 email_recomendacion VARCHAR(30) NOT NULL,
 nombre_recomendacion VARCHAR(20) NOT NULL,
 apellido_recomendacion VARCHAR(30) NOT NULL,
 PRIMARY KEY (id_recomendacion)
);

CREATE TABLE servicio (
 id_servicio INT NOT NULL AUTO_INCREMENT,
 tipo VARCHAR(30) NOT NULL,
 descripcion VARCHAR(50),
 precio DECIMAL(8, 2) NOT NULL,
 PRIMARY KEY (id_servicio)
);

CREATE TABLE tiene_disponibles (
 peluquero_id_usuario INT NOT NULL,
 id_horario_disponible INT NOT NULL,
 fecha_inicial_disponible DATE NOT NULL,
 fecha_final_disponible DATE NOT NULL,
 PRIMARY KEY (peluquero_id_usuario, id_horario_disponible)
);

CREATE TABLE tienev1 (
 producto_codigo_producto INT NOT NULL,
 carrito_id_carrito INT NOT NULL,
 PRIMARY KEY (producto_codigo_producto, carrito_id_carrito)
);

CREATE TABLE tienev2 (
 turno_id_turno INT NOT NULL,
 servicio_id_servicio INT NOT NULL,
 PRIMARY KEY (turno_id_turno, servicio_id_servicio)
);

CREATE TABLE tienev6 (
 bono_id_bono INT NOT NULL,
 recomendacion_id_recomendacion INT NOT NULL,
 PRIMARY KEY (bono_id_bono, recomendacion_id_recomendacion)
);

CREATE TABLE turno (
 id_turno INT NOT NULL AUTO_INCREMENT,
 fecha DATE NOT NULL,
 hora_inicio TIME NOT NULL,
 hora_fin TIME,
 estado VARCHAR(10) NOT NULL,
 peluquero_id_usuario INT NOT NULL,
 cliente_vendedor_id_usuario INT NOT NULL,
 administrador_id_usuario INT NOT NULL,
 PRIMARY KEY (id_turno)
);

CREATE TABLE rol (
    id INT NOT NULL,
    rol VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE usuario (
    id_usuario INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(20) NOT NULL,
    apellido VARCHAR(20) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(30),
    contrasenia VARCHAR(255) NOT NULL,
    rol INT NOT NULL,
    PRIMARY KEY (id_usuario),
    FOREIGN KEY (rol) REFERENCES rol(id)
);

CREATE TABLE administrador (
    id_usuario INT NOT NULL,
    PRIMARY KEY (id_usuario),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE vendedor (
    id_usuario INT NOT NULL,
    codigo VARCHAR(20) NOT NULL,
    PRIMARY KEY (id_usuario),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE cliente (
    id_usuario INT NOT NULL,
    fecha_nac DATE,
    vendedor_id_usuario INT,
    UNIQUE (vendedor_id_usuario),
    PRIMARY KEY (id_usuario),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (vendedor_id_usuario) REFERENCES vendedor(id_usuario)
);

CREATE TABLE peluquero (
    id_usuario INT NOT NULL,
    especialidad VARCHAR(30),
    PRIMARY KEY (id_usuario),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- Relación de claves foráneas
ALTER TABLE bono ADD FOREIGN KEY (cliente_vendedor_id_usuario) REFERENCES cliente(id_usuario);
ALTER TABLE carrito ADD FOREIGN KEY (cliente_id_usuario1) REFERENCES cliente(id_usuario);
ALTER TABLE carrito ADD FOREIGN KEY (vendedor_id_usuario) REFERENCES vendedor(id_usuario);
ALTER TABLE carrito ADD FOREIGN KEY (administrador_id_usuario) REFERENCES administrador(id_usuario);
ALTER TABLE mascota ADD FOREIGN KEY (cliente_vendedor_id_usuario) REFERENCES cliente(id_usuario);
ALTER TABLE producto ADD FOREIGN KEY (categoria_id_categoria) REFERENCES categoria(id_categoria);

INSERT INTO categoria (nombre_categoria)
VALUES ("Alimento para Perros");
INSERT INTO categoria (nombre_categoria)
VALUES ("Alimento para Gatos");
INSERT INTO categoria (nombre_categoria)
VALUES ("Otros Alimentos");
INSERT INTO categoria (nombre_categoria)
VALUES ("Accesorios");
INSERT INTO categoria (nombre_categoria)
VALUES ("Estética e Higiene");
INSERT INTO categoria (nombre_categoria)
VALUES ("Snacks");

ALTER TABLE producto
ADD COLUMN precio_producto INT(4) NOT NULL;
ALTER TABLE producto
ADD COLUMN image_url VARCHAR(255);


INSERT INTO rol (id, rol) VALUES 
(1, 'cliente'),
(2, 'vendedor'),
(3, 'peluquero'),
(4, 'administrador');

-- Crear triggers para manejar inserciones automáticas
DELIMITER $$

CREATE TRIGGER after_usuario_insert
AFTER INSERT ON usuario
FOR EACH ROW
BEGIN
    CASE NEW.rol
        WHEN 1 THEN
            INSERT INTO cliente (id_usuario, fecha_nac, vendedor_id_usuario) VALUES (NEW.id_usuario, NULL, NULL);
        WHEN 2 THEN
            INSERT INTO vendedor (id_usuario, codigo) VALUES (NEW.id_usuario, '');
        WHEN 3 THEN
            INSERT INTO peluquero (id_usuario, especialidad) VALUES (NEW.id_usuario, NULL);
        WHEN 4 THEN
            INSERT INTO administrador (id_usuario) VALUES (NEW.id_usuario);
    END CASE;
END$$

DELIMITER ;