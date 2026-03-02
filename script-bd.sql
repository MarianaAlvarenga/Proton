-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3307
-- Tiempo de generación: 02-03-2026 a las 15:01:11
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `proton`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administrador`
--

CREATE TABLE `administrador` (
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `administrador`
--

INSERT INTO `administrador` (`id_usuario`) VALUES
(2),
(29),
(32),
(86),
(109),
(111);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencia`
--

CREATE TABLE `asistencia` (
  `id_asistencia` int(11) NOT NULL,
  `id_turno` int(11) NOT NULL,
  `estado` varchar(30) NOT NULL,
  `hora_de_llegada` time DEFAULT NULL,
  `hora_de_finalizacion` time DEFAULT NULL,
  `observaciones` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bono`
--

CREATE TABLE `bono` (
  `id_bono` int(11) NOT NULL,
  `porcentaje_descuento` tinyint(4) DEFAULT NULL,
  `cliente_vendedor_id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `id_carrito` int(11) NOT NULL,
  `fecha_carrito` date NOT NULL,
  `hora_carrito` time NOT NULL,
  `cliente_id_usuario1` int(11) DEFAULT NULL,
  `vendedor_id_usuario` int(11) DEFAULT NULL,
  `administrador_id_usuario` int(11) DEFAULT NULL,
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `cliente_id_usuario_no_registrado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carrito`
--

INSERT INTO `carrito` (`id_carrito`, `fecha_carrito`, `hora_carrito`, `cliente_id_usuario1`, `vendedor_id_usuario`, `administrador_id_usuario`, `total`, `cliente_id_usuario_no_registrado`) VALUES
(116, '2026-02-17', '18:12:44', NULL, NULL, 111, 1800.00, 50),
(117, '2026-02-17', '18:14:27', NULL, NULL, 111, 3823.00, 51),
(118, '2026-02-17', '18:24:11', NULL, NULL, 111, 1500.00, 52),
(119, '2026-02-17', '18:26:17', NULL, NULL, 111, 300.00, 53);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `id_categoria` int(11) NOT NULL,
  `nombre_categoria` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`id_categoria`, `nombre_categoria`) VALUES
(1, 'Alimento para Perros'),
(2, 'Alimento para Gatos'),
(3, 'Otros Alimentos'),
(4, 'Accesorios'),
(5, 'Estética e Higiene'),
(6, 'Snacks');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`id_usuario`) VALUES
(105);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dias_disponibles`
--

CREATE TABLE `dias_disponibles` (
  `id_dias_disponibles` int(11) NOT NULL,
  `fecha_disponible` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `dias_disponibles`
--

INSERT INTO `dias_disponibles` (`id_dias_disponibles`, `fecha_disponible`) VALUES
(142, '2026-03-02'),
(143, '2026-03-03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dias_horas_disponibles`
--

CREATE TABLE `dias_horas_disponibles` (
  `id_dias_disponibles` int(11) NOT NULL,
  `id_horario_disponible` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `dias_horas_disponibles`
--

INSERT INTO `dias_horas_disponibles` (`id_dias_disponibles`, `id_horario_disponible`, `id_usuario`) VALUES
(142, 289, 112),
(142, 290, 112),
(142, 291, 112),
(142, 292, 112),
(142, 293, 112),
(143, 294, 112),
(143, 295, 112),
(143, 296, 112),
(143, 297, 112),
(143, 298, 112);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horas_disponibles`
--

CREATE TABLE `horas_disponibles` (
  `id_horario_disponible` int(11) NOT NULL,
  `hora_inicial` time NOT NULL,
  `hora_final` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `horas_disponibles`
--

INSERT INTO `horas_disponibles` (`id_horario_disponible`, `hora_inicial`, `hora_final`) VALUES
(289, '14:00:00', '14:30:00'),
(290, '14:30:00', '15:00:00'),
(291, '15:00:00', '15:30:00'),
(292, '15:30:00', '16:00:00'),
(293, '16:00:00', '16:30:00'),
(294, '01:00:00', '01:30:00'),
(295, '01:30:00', '02:00:00'),
(296, '02:00:00', '02:30:00'),
(297, '03:00:00', '03:30:00'),
(298, '03:30:00', '04:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mascota`
--

CREATE TABLE `mascota` (
  `id_mascota` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `nombre_mascota` varchar(30) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `raza` varchar(20) NOT NULL,
  `peso` float(5,2) DEFAULT NULL,
  `tamanio` varchar(20) NOT NULL,
  `largo_pelo` varchar(20) DEFAULT NULL,
  `especie` varchar(100) DEFAULT NULL,
  `sexo` varchar(10) DEFAULT NULL,
  `color` varchar(100) DEFAULT NULL,
  `detalle` text DEFAULT NULL,
  `img_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mascota`
--

INSERT INTO `mascota` (`id_mascota`, `id_usuario`, `nombre_mascota`, `fecha_nacimiento`, `raza`, `peso`, `tamanio`, `largo_pelo`, `especie`, `sexo`, `color`, `detalle`, `img_url`) VALUES
(7, 105, 'efqfeq', '2026-01-01', 'wqdwd', 999.99, 'Mediano', 'Corto', 'Gato', 'Macho', 'weqw', 'qweqwe', 'petimg_6966c2f0b3a558.44231580.jpg'),
(8, 105, 'sdasd', '2025-12-31', 'wqeqw', 232.00, 'Mediano', 'Medio', 'Gato', 'Hembra', 'weqw', 'qweqweq', 'blob:https://courtesy-warren-minimize-physically.trycloudflare.com/0c626f63-1d96-4587-a3ef-502a5beee57e');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `peluquero`
--

CREATE TABLE `peluquero` (
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `peluquero`
--

INSERT INTO `peluquero` (`id_usuario`) VALUES
(112),
(113);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `peluquero_ofrece_servicio`
--

CREATE TABLE `peluquero_ofrece_servicio` (
  `peluquero_id_usuario` int(11) NOT NULL,
  `servicio_id_servicio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `peluquero_ofrece_servicio`
--

INSERT INTO `peluquero_ofrece_servicio` (`peluquero_id_usuario`, `servicio_id_servicio`) VALUES
(112, 1),
(112, 2),
(113, 1),
(113, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `codigo_producto` int(11) NOT NULL,
  `nombre_producto` varchar(30) NOT NULL,
  `descripcion_producto` varchar(50) DEFAULT NULL,
  `stock_producto` int(11) NOT NULL,
  `punto_reposicion` int(11) DEFAULT NULL,
  `categoria_id_categoria` int(11) NOT NULL,
  `precio_producto` float(7,2) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`codigo_producto`, `nombre_producto`, `descripcion_producto`, `stock_producto`, `punto_reposicion`, `categoria_id_categoria`, `precio_producto`, `image_url`) VALUES
(7781, 'alimento humedo', '', 2, 10, 1, 4000.00, 'http://localhost:8080/Proton/backend/uploads/67e183a5a6410_comida-lata.jpg'),
(7782, 'hueso', '3weqweqw', 3, 10, 4, 300.00, 'http://localhost:8888/backend/uploads/1765131398_2.png'),
(7783, 'cepillo alambree', 'vvbcb', 6, 1, 5, 1500.00, 'http://localhost:8888/backend/uploads/1768319297_life xd.png'),
(7784, 'cama', 'sd', 0, 1, 4, 18000.00, 'http://localhost:8080/Proton/backend/uploads/67f80cfa21b72_cama.jpg'),
(7787, 'APA LA PAPA', 'y si... y siiiii', 3, 10, 5, 92.00, '/backend/uploads/1765129759_13.png'),
(7788, 'sdasda', 'asdasdas', 0, 1, 4, 2323.00, 'http://localhost:8888/backend/uploads/1765130770_12.png'),
(7789, 'egerg', 'arfgerwgf', 153, 1, 1, 200.00, '/backend/uploads/1765130537_2.png'),
(7799, 'El Chocolatin misterioso super', 'asdasdasdas', 8, 8, 1, 100.00, 'http://localhost:8080/Proton/backend/uploads/696196ba4ecca_universo tangente 1.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `realiza`
--

CREATE TABLE `realiza` (
  `cliente_id_usuario` int(11) NOT NULL,
  `recomendacion_id_recomendacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recomendacion`
--

CREATE TABLE `recomendacion` (
  `id_recomendacion` int(11) NOT NULL,
  `email_recomendacion` varchar(30) NOT NULL,
  `nombre_recomendacion` varchar(20) NOT NULL,
  `apellido_recomendacion` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol`
--

CREATE TABLE `rol` (
  `id` int(11) NOT NULL,
  `rol` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `rol`
--

INSERT INTO `rol` (`id`, `rol`) VALUES
(1, 'cliente'),
(2, 'vendedor'),
(3, 'peluquero'),
(4, 'administrador');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicio`
--

CREATE TABLE `servicio` (
  `id_servicio` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  `precio` decimal(8,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `servicio`
--

INSERT INTO `servicio` (`id_servicio`, `nombre`, `descripcion`, `precio`) VALUES
(1, 'Corte básico', 'Corte de pelo estándar para perros de todas las razas, incluye lavado y secado.', 2500.00),
(2, 'Baño completo', 'Baño con shampoo neutro, secado y cepillado, recomendado para mantener la higiene general.', 1800.00),
(3, 'Despeinado fashion', 'Corte creativo con peinado estilo mohawk canino, incluye fotito para Instagram.', 3500.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicio_prestado_en_turno`
--

CREATE TABLE `servicio_prestado_en_turno` (
  `turno_id_turno` int(11) NOT NULL,
  `servicio_id_servicio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tienev1`
--

CREATE TABLE `tienev1` (
  `producto_codigo_producto` int(11) NOT NULL,
  `carrito_id_carrito` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tienev1`
--

INSERT INTO `tienev1` (`producto_codigo_producto`, `carrito_id_carrito`, `cantidad`) VALUES
(7782, 116, 1),
(7782, 119, 1),
(7783, 116, 1),
(7783, 117, 1),
(7783, 118, 1),
(7788, 117, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tienev6`
--

CREATE TABLE `tienev6` (
  `bono_id_bono` int(11) NOT NULL,
  `recomendacion_id_recomendacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turno`
--

CREATE TABLE `turno` (
  `id_turno` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `pagado` tinyint(1) NOT NULL DEFAULT 0,
  `hora_inicio` time NOT NULL,
  `hora_fin` time DEFAULT NULL,
  `cliente_id` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `id_peluquero` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `apellido` varchar(20) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `email` varchar(30) DEFAULT NULL,
  `contrasenia` varchar(255) NOT NULL,
  `rol` int(11) NOT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `img_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre`, `apellido`, `telefono`, `email`, `contrasenia`, `rol`, `fecha_nacimiento`, `img_url`) VALUES
(105, 'Clientee', 'Cliente', '2', 'cliente@cliente.com', '$2y$10$NDaC6naDr9AbPgjdnECRHeMDl4UuZiqIvOWbwKt0Bb3rfpW.srKhq', 1, NULL, 'usuarios/user_105_1767627155.png'),
(111, 'Administrador', 'Administrador', '1', 'lol@lol.com', '$2y$10$EIx.HjlNmcFMKVKCIZgSXORATvNTIHBbY933IjvV.2ezSejSIkNEu', 4, '2026-01-03', 'usuarios/img_695bda387ed36.png'),
(112, 'Peluca1', 'Peluca1', '1', 'peluca1@peluca1.com', '$2y$10$OR74wHqrCFvtWJdeJc8JJep6/V8m4AElbKcP2aAU8I0Vo13.ieUkO', 3, NULL, 'https://indicate-fantastic-petite-becoming.trycloudflare.com/backend/uploads/users/user_112.png'),
(113, 'Peluca2', 'Peluca2', '1', 'peluca2@peluca2.com', '$2y$10$4p1EZ/FcbAMw822c90UNneP.qzI5nbwQI1ZtVGWJz37P1NTDIJUGG', 3, NULL, 'https://indicate-fantastic-petite-becoming.trycloudflare.com/backend/uploads/users/user_113.png'),
(114, 'Venduca', 'Venduca', '1', 'venduca@venduca.com', '$2y$10$CUy2hjW8S4qgxbws3G0cSeYqXSjp.dM/IcMzAXTJJJP5oR2TRJkTe', 2, NULL, 'usuarios/img_6966c2c6778a2.jpg');

--
-- Disparadores `usuario`
--
DELIMITER $$
CREATE TRIGGER `after_usuario_insert` AFTER INSERT ON `usuario` FOR EACH ROW BEGIN
    CASE NEW.rol
        WHEN 1 THEN
            INSERT INTO cliente (id_usuario) VALUES (NEW.id_usuario);
        WHEN 2 THEN
            INSERT INTO vendedor (id_usuario) VALUES (NEW.id_usuario);
        WHEN 3 THEN
            INSERT INTO peluquero (id_usuario) VALUES (NEW.id_usuario);
        WHEN 4 THEN
            INSERT INTO administrador (id_usuario) VALUES (NEW.id_usuario);
    END CASE;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_no_registrado`
--

CREATE TABLE `usuario_no_registrado` (
  `id_usuario_no_registrado` int(11) NOT NULL,
  `id_carrito` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario_no_registrado`
--

INSERT INTO `usuario_no_registrado` (`id_usuario_no_registrado`, `id_carrito`) VALUES
(50, 116),
(51, 117),
(52, 118),
(53, 119);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vendedor`
--

CREATE TABLE `vendedor` (
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `vendedor`
--

INSERT INTO `vendedor` (`id_usuario`) VALUES
(114);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `administrador`
--
ALTER TABLE `administrador`
  ADD PRIMARY KEY (`id_usuario`);

--
-- Indices de la tabla `asistencia`
--
ALTER TABLE `asistencia`
  ADD PRIMARY KEY (`id_asistencia`),
  ADD KEY `fk_asistencia_turno` (`id_turno`);

--
-- Indices de la tabla `bono`
--
ALTER TABLE `bono`
  ADD PRIMARY KEY (`id_bono`),
  ADD KEY `cliente_vendedor_id_usuario` (`cliente_vendedor_id_usuario`);

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`id_carrito`),
  ADD KEY `cliente_id_usuario1` (`cliente_id_usuario1`),
  ADD KEY `vendedor_id_usuario` (`vendedor_id_usuario`),
  ADD KEY `administrador_id_usuario` (`administrador_id_usuario`);

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id_usuario`);

--
-- Indices de la tabla `dias_disponibles`
--
ALTER TABLE `dias_disponibles`
  ADD PRIMARY KEY (`id_dias_disponibles`);

--
-- Indices de la tabla `dias_horas_disponibles`
--
ALTER TABLE `dias_horas_disponibles`
  ADD PRIMARY KEY (`id_dias_disponibles`,`id_horario_disponible`),
  ADD KEY `id_horario_disponible` (`id_horario_disponible`),
  ADD KEY `fk_dhd_usuario` (`id_usuario`);

--
-- Indices de la tabla `horas_disponibles`
--
ALTER TABLE `horas_disponibles`
  ADD PRIMARY KEY (`id_horario_disponible`);

--
-- Indices de la tabla `mascota`
--
ALTER TABLE `mascota`
  ADD PRIMARY KEY (`id_mascota`),
  ADD KEY `fk_mascota_usuario` (`id_usuario`);

--
-- Indices de la tabla `peluquero`
--
ALTER TABLE `peluquero`
  ADD PRIMARY KEY (`id_usuario`);

--
-- Indices de la tabla `peluquero_ofrece_servicio`
--
ALTER TABLE `peluquero_ofrece_servicio`
  ADD PRIMARY KEY (`peluquero_id_usuario`,`servicio_id_servicio`),
  ADD KEY `fk_peluquero_servicio_servicio` (`servicio_id_servicio`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`codigo_producto`),
  ADD KEY `categoria_id_categoria` (`categoria_id_categoria`);

--
-- Indices de la tabla `realiza`
--
ALTER TABLE `realiza`
  ADD PRIMARY KEY (`cliente_id_usuario`,`recomendacion_id_recomendacion`);

--
-- Indices de la tabla `recomendacion`
--
ALTER TABLE `recomendacion`
  ADD PRIMARY KEY (`id_recomendacion`);

--
-- Indices de la tabla `rol`
--
ALTER TABLE `rol`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `servicio`
--
ALTER TABLE `servicio`
  ADD PRIMARY KEY (`id_servicio`);

--
-- Indices de la tabla `servicio_prestado_en_turno`
--
ALTER TABLE `servicio_prestado_en_turno`
  ADD PRIMARY KEY (`turno_id_turno`,`servicio_id_servicio`),
  ADD KEY `servicio_id_servicio` (`servicio_id_servicio`);

--
-- Indices de la tabla `tienev1`
--
ALTER TABLE `tienev1`
  ADD PRIMARY KEY (`producto_codigo_producto`,`carrito_id_carrito`),
  ADD KEY `fk_tienev1_carrito` (`carrito_id_carrito`);

--
-- Indices de la tabla `tienev6`
--
ALTER TABLE `tienev6`
  ADD PRIMARY KEY (`bono_id_bono`,`recomendacion_id_recomendacion`);

--
-- Indices de la tabla `turno`
--
ALTER TABLE `turno`
  ADD PRIMARY KEY (`id_turno`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD KEY `rol` (`rol`);

--
-- Indices de la tabla `usuario_no_registrado`
--
ALTER TABLE `usuario_no_registrado`
  ADD PRIMARY KEY (`id_usuario_no_registrado`),
  ADD KEY `id_carrito` (`id_carrito`);

--
-- Indices de la tabla `vendedor`
--
ALTER TABLE `vendedor`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `asistencia`
--
ALTER TABLE `asistencia`
  MODIFY `id_asistencia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `bono`
--
ALTER TABLE `bono`
  MODIFY `id_bono` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
  MODIFY `id_carrito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=120;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `dias_disponibles`
--
ALTER TABLE `dias_disponibles`
  MODIFY `id_dias_disponibles` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=144;

--
-- AUTO_INCREMENT de la tabla `dias_horas_disponibles`
--
ALTER TABLE `dias_horas_disponibles`
  MODIFY `id_horario_disponible` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=299;

--
-- AUTO_INCREMENT de la tabla `horas_disponibles`
--
ALTER TABLE `horas_disponibles`
  MODIFY `id_horario_disponible` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=299;

--
-- AUTO_INCREMENT de la tabla `mascota`
--
ALTER TABLE `mascota`
  MODIFY `id_mascota` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `codigo_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7800;

--
-- AUTO_INCREMENT de la tabla `recomendacion`
--
ALTER TABLE `recomendacion`
  MODIFY `id_recomendacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `servicio`
--
ALTER TABLE `servicio`
  MODIFY `id_servicio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `turno`
--
ALTER TABLE `turno`
  MODIFY `id_turno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=268;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=117;

--
-- AUTO_INCREMENT de la tabla `usuario_no_registrado`
--
ALTER TABLE `usuario_no_registrado`
  MODIFY `id_usuario_no_registrado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `asistencia`
--
ALTER TABLE `asistencia`
  ADD CONSTRAINT `fk_asistencia_turno` FOREIGN KEY (`id_turno`) REFERENCES `turno` (`id_turno`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `bono`
--
ALTER TABLE `bono`
  ADD CONSTRAINT `bono_ibfk_1` FOREIGN KEY (`cliente_vendedor_id_usuario`) REFERENCES `cliente` (`id_usuario`);

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`cliente_id_usuario1`) REFERENCES `cliente` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `carrito_ibfk_2` FOREIGN KEY (`vendedor_id_usuario`) REFERENCES `vendedor` (`id_usuario`),
  ADD CONSTRAINT `carrito_ibfk_3` FOREIGN KEY (`administrador_id_usuario`) REFERENCES `administrador` (`id_usuario`);

--
-- Filtros para la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD CONSTRAINT `cliente_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `dias_horas_disponibles`
--
ALTER TABLE `dias_horas_disponibles`
  ADD CONSTRAINT `dias_horas_disponibles_ibfk_1` FOREIGN KEY (`id_dias_disponibles`) REFERENCES `dias_disponibles` (`id_dias_disponibles`) ON DELETE CASCADE,
  ADD CONSTRAINT `dias_horas_disponibles_ibfk_2` FOREIGN KEY (`id_horario_disponible`) REFERENCES `horas_disponibles` (`id_horario_disponible`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_dhd_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `mascota`
--
ALTER TABLE `mascota`
  ADD CONSTRAINT `fk_mascota_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `peluquero`
--
ALTER TABLE `peluquero`
  ADD CONSTRAINT `peluquero_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `peluquero_ofrece_servicio`
--
ALTER TABLE `peluquero_ofrece_servicio`
  ADD CONSTRAINT `fk_peluquero_servicio_servicio` FOREIGN KEY (`servicio_id_servicio`) REFERENCES `servicio` (`id_servicio`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_peluquero_servicio_usuario` FOREIGN KEY (`peluquero_id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`categoria_id_categoria`) REFERENCES `categoria` (`id_categoria`);

--
-- Filtros para la tabla `servicio_prestado_en_turno`
--
ALTER TABLE `servicio_prestado_en_turno`
  ADD CONSTRAINT `servicio_prestado_en_turno_ibfk_1` FOREIGN KEY (`servicio_id_servicio`) REFERENCES `servicio` (`id_servicio`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `servicio_prestado_en_turno_ibfk_2` FOREIGN KEY (`turno_id_turno`) REFERENCES `turno` (`id_turno`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `tienev1`
--
ALTER TABLE `tienev1`
  ADD CONSTRAINT `fk_tienev1_carrito` FOREIGN KEY (`carrito_id_carrito`) REFERENCES `carrito` (`id_carrito`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tienev1_producto` FOREIGN KEY (`producto_codigo_producto`) REFERENCES `producto` (`codigo_producto`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`rol`) REFERENCES `rol` (`id`);

--
-- Filtros para la tabla `usuario_no_registrado`
--
ALTER TABLE `usuario_no_registrado`
  ADD CONSTRAINT `usuario_no_registrado_ibfk_1` FOREIGN KEY (`id_carrito`) REFERENCES `carrito` (`id_carrito`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `vendedor`
--
ALTER TABLE `vendedor`
  ADD CONSTRAINT `vendedor_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
