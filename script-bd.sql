-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3307
-- Tiempo de generación: 23-03-2025 a las 17:32:42
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
(29);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencia`
--

CREATE TABLE `asistencia` (
  `id_asistencia` int(11) NOT NULL,
  `id_turno` int(11) NOT NULL,
  `estado` tinyint(1) NOT NULL,
  `hora_de _llegada` time DEFAULT NULL,
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
(1, '2025-02-04', '13:53:32', NULL, NULL, NULL, 2800.00, NULL),
(2, '2025-02-04', '14:28:16', NULL, NULL, NULL, 2800.00, 2),
(4, '2025-02-04', '14:53:08', NULL, NULL, 2, 2800.00, NULL),
(5, '2025-02-04', '15:08:13', NULL, NULL, NULL, 2800.00, 3),
(6, '2025-02-05', '14:16:54', NULL, NULL, NULL, 2853.00, 4),
(7, '2025-02-05', '14:18:36', NULL, NULL, NULL, 2800.00, 5),
(8, '2025-02-05', '14:19:01', NULL, NULL, NULL, 2800.00, 6),
(9, '2025-02-05', '14:20:28', NULL, NULL, NULL, 50.00, 7),
(10, '2025-02-05', '14:20:52', NULL, NULL, NULL, 50.00, 8),
(11, '2025-03-17', '15:54:32', NULL, NULL, NULL, 3.00, 9),
(12, '2025-03-17', '15:55:44', NULL, NULL, NULL, 3.00, 10),
(13, '2025-03-17', '16:34:34', NULL, NULL, NULL, 83.00, 1),
(14, '2025-03-17', '16:39:52', NULL, NULL, NULL, 33.00, 2),
(15, '2025-03-17', '17:24:59', NULL, NULL, NULL, 3124.00, 3),
(16, '2025-03-17', '17:44:13', NULL, NULL, NULL, 2850.00, 4),
(17, '2025-03-18', '00:30:09', NULL, NULL, NULL, 2282.00, 5),
(18, '2025-03-18', '00:33:00', NULL, NULL, NULL, 50.00, 6),
(19, '2025-03-18', '00:41:11', NULL, NULL, NULL, 3350.00, 7),
(20, '2025-03-18', '19:02:33', NULL, NULL, NULL, 166.00, 8),
(36, '2025-03-18', '23:58:43', NULL, NULL, 2, 2800.00, 13),
(37, '2025-03-18', '23:59:16', 30, NULL, 2, 2800.00, NULL),
(38, '2025-03-18', '23:59:55', NULL, 28, NULL, 2800.00, 14),
(39, '2025-03-19', '00:00:23', 30, 28, NULL, 2800.00, NULL),
(40, '2025-03-19', '00:00:56', 30, NULL, NULL, 2800.00, NULL),
(41, '2025-03-19', '00:02:16', 30, NULL, NULL, 2800.00, NULL);

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
  `id_usuario` int(11) NOT NULL,
  `fecha_nac` date DEFAULT NULL,
  `vendedor_id_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`id_usuario`, `fecha_nac`, `vendedor_id_usuario`) VALUES
(3, NULL, NULL),
(12, NULL, NULL),
(15, NULL, NULL),
(17, NULL, NULL),
(21, NULL, NULL),
(25, NULL, NULL),
(30, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dias_disponibles`
--

CREATE TABLE `dias_disponibles` (
  `id_dias_disponibles` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_disponible` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dias_horas_disponibles`
--

CREATE TABLE `dias_horas_disponibles` (
  `id_dias_disponibles` int(11) NOT NULL,
  `id_horario_disponible` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horas_disponibles`
--

CREATE TABLE `horas_disponibles` (
  `id_horario_disponible` int(11) NOT NULL,
  `hora_inicial` time NOT NULL,
  `hora_final` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mascota`
--

CREATE TABLE `mascota` (
  `id_mascota` int(11) NOT NULL,
  `nombre_mascota` varchar(30) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `raza` varchar(20) NOT NULL,
  `peso` float(5,2) DEFAULT NULL,
  `tamanio` varchar(20) NOT NULL,
  `largo_pelo` varchar(20) DEFAULT NULL,
  `cliente_vendedor_id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `peluquero`
--

CREATE TABLE `peluquero` (
  `id_usuario` int(11) NOT NULL,
  `especialidad` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `peluquero`
--

INSERT INTO `peluquero` (`id_usuario`, `especialidad`) VALUES
(10, NULL),
(18, NULL),
(23, NULL),
(24, NULL),
(27, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `peluquero_ofrece_servicio`
--

CREATE TABLE `peluquero_ofrece_servicio` (
  `peluquero_id_usuario` int(11) NOT NULL,
  `servicio_id_servicio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, 'philly', 'sdasdasdasdasdasdas', 99, 30, 1, 500.00, 'http://localhost:8080/Proton/backend/uploads/67d8d35b563cf_philly.png'),
(462, 'El Chocolatin misterioso super', 'riquísimo, pero no para perros ni gatos', 1465, 1, 6, 2800.00, 'http://localhost:8080/Proton/backend/uploads/679ba8467ed3b_bepis.png'),
(676, 'pappa', 'fafasf', 410, 2, 1, 50.00, 'http://localhost:8080/Proton/backend/uploads/6742639f2cd46_alimento4.png'),
(887, 'ffafaf', 'daSDAs', 311, 2, 4, 33.00, 'http://localhost:8080/Proton/backend/uploads/674268d267223_accesorio1.png'),
(2223, 'wewewwww', 'holi, te estoy modificando', 3230, 2, 1, 21.00, 'http://localhost:8080/Proton/backend/uploads/6742632ceb56f_alimento1.png'),
(2467, '4341251', 'asdasd', 241, 3, 4, 232.00, NULL),
(7777, 'gatito lionmdo', 'fsdfsdfsd', 342, 12, 2, 2232.00, NULL),
(7778, 'cazabobos', 'sss', 1500, 20, 5, 5986.00, 'http://localhost:8080/Proton/backend/uploads/67d9cfde72b91_tfc.png'),
(7779, 'cachafaz', 'alfajorcinho', 100, 20, 6, 2500.00, 'http://localhost:8080/Proton/backend/uploads/67d9d6e14c96a_VTV turno.png'),
(7780, 'debe ser por el muchacho este ', 'seguramente', 150, 10, 1, 6337.00, 'http://localhost:8080/Proton/backend/uploads/67d9d859ceaf1_Sin título.png');

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
  `tipo` varchar(30) NOT NULL,
  `descripcion` varchar(50) DEFAULT NULL,
  `precio` decimal(8,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `carrito_id_carrito` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Estructura de tabla para la tabla `tiene_dias`
--

CREATE TABLE `tiene_dias` (
  `id_usuario` int(11) NOT NULL,
  `id_dias_disponibles` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turno`
--

CREATE TABLE `turno` (
  `id_turno` int(11) NOT NULL,
  `fecha` date NOT NULL,
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
  `rol` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre`, `apellido`, `telefono`, `email`, `contrasenia`, `rol`) VALUES
(2, 'Lol', 'Istrador', '123456789', 'lol@lol.com', '$2y$10$Dc544k5adRVrzIBHVcW5qui.461915YUAh.9rPwNkqCJrgGtvUCWu', 4),
(3, 'Gasti Lindo', 'García', '1541724146', 'gaston.garcia89@hotmail.com', '$2y$10$GvC7G1ZgJ2lRNb5wesayoeYAGJrh/h5mgzmLT3zKLt3cDBg3DtaPW', 1),
(10, 'peluca', 'sabe un montonazo', '646452', 'peluca@sabe.com', '$2y$10$vhrLY/3Jtd.s97g.uXPb0OQX35IE.AIuXTkZ9gTuwLJL.527MfaDW', 3),
(12, 'aasa', 'eqeqq', '1542224106', 'gaston.garcia89@212hotmail.com', '$2y$10$cuO3ebcfvvHq3M3NfSKWYeFgi8j0r/aAVeBOQBd/6kbuE.1J0pG22', 1),
(15, 'Maru', 'Bonita', '16547', 'aaaa@aa', '$2y$10$EaJgJoXfQoGTWzcd5pQCmOebPyqHA.J4bv3jqi2Fll8m6eJgtEJKO', 1),
(17, 'ww', 'asda', '1511124106', 'gaston.garcqqia89@hotmail.com', '$2y$10$ZMxWQgaKY89M2LTPyFd3YuLpn/Rt812.ikRVoBY0aYYUDTGRZNo7S', 1),
(18, 'peluquin casparuli', 'arroyoseco', '798645', 'pelucademivida@lala', '$2y$10$3bWMJFdi3Kmc6oZQMm9LO.DW7CP/x9AlhahMEuOWDTmulMv8xeFEW', 3),
(21, 'proti', 'bonito y lindo', '13264579', 'pro@pro', '$2y$10$fgZKZbZlr6j78WTZEBYx8ehyp3besbwuvF.nZDj1En2o2FqbC/.ZK', 1),
(23, 'marulinda', 'afedafas', '232', 'asfasf@s.com', '$2y$10$6.RsshUzbPnEA26bpnJY.u0m3bg4wRd.804v0CGplt6NFv/LnPFFC', 3),
(24, 'pepito', 'clavo un clavito', '111221', 'pepito@pepito.com', '$2y$10$BWuTSKevGIduSY5ABjE7veMkH0ircujZQTdbjF7iET31b432Es4pa', 3),
(25, 'cliente1', 'cliente1', '123456789', 'cliente1@cliente1.com', '$2y$10$QBo/OnX3WcoJDhZ13CGG..0oHx73SFYAzh1KITQq6y8XHYGOgfSk6', 1),
(27, 'peluca', 'peluca', '123', 'peluca@peluca.com', '$2y$10$M52DxHfuitvMyookIcFAPOdFjBLUhRA1K2DWqjpD2l3DeZm9wt3f.', 3),
(28, 'venduca', 'venduca', '321654', 'venduca@venduca.com', '$2y$10$Q1Kyh0ntgdlUzAarxPgPL.uUAN5FgtIL.ifvdk/hk8MRGDMMSFt8a', 2),
(29, 'fff', 'fff', '55', 'fafaf@rrr.com', '$2y$10$lT5m54Al9pEzjcQsg.dAye.xRHWnhrlWzdjGWbWW0MbvjtFftsF.e', 4),
(30, 'lol2', 'ddd', '123', 'lol2@lol2.com', '$2y$10$5w/1s/QYfdDu0GLk/TqgIebRutbRXcq4vb7hVHKJle6oCpXJCSxUC', 1),
(31, 'lol3', 'fadsda', '2332', 'lol3@lol3.com', '$2y$10$nI1ZYyRwPrya2Hm3Gf5zYuS8QD7Mxx1kB1e4s2CVfAX3CTxfMvpw6', 2);

--
-- Disparadores `usuario`
--
DELIMITER $$
CREATE TRIGGER `after_usuario_insert` AFTER INSERT ON `usuario` FOR EACH ROW BEGIN
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
(1, 13),
(2, 14),
(3, 15),
(4, 16),
(5, 17),
(6, 18),
(7, 19),
(8, 20),
(13, 36),
(14, 38);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vendedor`
--

CREATE TABLE `vendedor` (
  `id_usuario` int(11) NOT NULL,
  `codigo` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `vendedor`
--

INSERT INTO `vendedor` (`id_usuario`, `codigo`) VALUES
(28, ''),
(31, '');

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
  ADD PRIMARY KEY (`id_asistencia`);

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
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `vendedor_id_usuario` (`vendedor_id_usuario`);

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
  ADD KEY `id_horario_disponible` (`id_horario_disponible`);

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
  ADD KEY `cliente_vendedor_id_usuario` (`cliente_vendedor_id_usuario`);

--
-- Indices de la tabla `peluquero`
--
ALTER TABLE `peluquero`
  ADD PRIMARY KEY (`id_usuario`);

--
-- Indices de la tabla `peluquero_ofrece_servicio`
--
ALTER TABLE `peluquero_ofrece_servicio`
  ADD PRIMARY KEY (`peluquero_id_usuario`,`servicio_id_servicio`);

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
  ADD PRIMARY KEY (`turno_id_turno`,`servicio_id_servicio`);

--
-- Indices de la tabla `tienev1`
--
ALTER TABLE `tienev1`
  ADD PRIMARY KEY (`producto_codigo_producto`,`carrito_id_carrito`);

--
-- Indices de la tabla `tienev6`
--
ALTER TABLE `tienev6`
  ADD PRIMARY KEY (`bono_id_bono`,`recomendacion_id_recomendacion`);

--
-- Indices de la tabla `tiene_dias`
--
ALTER TABLE `tiene_dias`
  ADD PRIMARY KEY (`id_usuario`,`id_dias_disponibles`),
  ADD KEY `id_dias_disponibles` (`id_dias_disponibles`);

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
  MODIFY `id_asistencia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `bono`
--
ALTER TABLE `bono`
  MODIFY `id_bono` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
  MODIFY `id_carrito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `horas_disponibles`
--
ALTER TABLE `horas_disponibles`
  MODIFY `id_horario_disponible` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mascota`
--
ALTER TABLE `mascota`
  MODIFY `id_mascota` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `codigo_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7781;

--
-- AUTO_INCREMENT de la tabla `recomendacion`
--
ALTER TABLE `recomendacion`
  MODIFY `id_recomendacion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `servicio`
--
ALTER TABLE `servicio`
  MODIFY `id_servicio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `turno`
--
ALTER TABLE `turno`
  MODIFY `id_turno` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `usuario_no_registrado`
--
ALTER TABLE `usuario_no_registrado`
  MODIFY `id_usuario_no_registrado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `administrador`
--
ALTER TABLE `administrador`
  ADD CONSTRAINT `administrador_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `bono`
--
ALTER TABLE `bono`
  ADD CONSTRAINT `bono_ibfk_1` FOREIGN KEY (`cliente_vendedor_id_usuario`) REFERENCES `cliente` (`id_usuario`);

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`cliente_id_usuario1`) REFERENCES `cliente` (`id_usuario`),
  ADD CONSTRAINT `carrito_ibfk_2` FOREIGN KEY (`vendedor_id_usuario`) REFERENCES `vendedor` (`id_usuario`),
  ADD CONSTRAINT `carrito_ibfk_3` FOREIGN KEY (`administrador_id_usuario`) REFERENCES `administrador` (`id_usuario`);

--
-- Filtros para la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD CONSTRAINT `cliente_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `cliente_ibfk_2` FOREIGN KEY (`vendedor_id_usuario`) REFERENCES `vendedor` (`id_usuario`);

--
-- Filtros para la tabla `dias_horas_disponibles`
--
ALTER TABLE `dias_horas_disponibles`
  ADD CONSTRAINT `dias_horas_disponibles_ibfk_1` FOREIGN KEY (`id_dias_disponibles`) REFERENCES `dias_disponibles` (`id_dias_disponibles`) ON DELETE CASCADE,
  ADD CONSTRAINT `dias_horas_disponibles_ibfk_2` FOREIGN KEY (`id_horario_disponible`) REFERENCES `horas_disponibles` (`id_horario_disponible`) ON DELETE CASCADE;

--
-- Filtros para la tabla `mascota`
--
ALTER TABLE `mascota`
  ADD CONSTRAINT `mascota_ibfk_1` FOREIGN KEY (`cliente_vendedor_id_usuario`) REFERENCES `cliente` (`id_usuario`);

--
-- Filtros para la tabla `peluquero`
--
ALTER TABLE `peluquero`
  ADD CONSTRAINT `peluquero_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`categoria_id_categoria`) REFERENCES `categoria` (`id_categoria`);

--
-- Filtros para la tabla `tiene_dias`
--
ALTER TABLE `tiene_dias`
  ADD CONSTRAINT `tiene_dias_ibfk_1` FOREIGN KEY (`id_dias_disponibles`) REFERENCES `dias_disponibles` (`id_dias_disponibles`) ON DELETE CASCADE,
  ADD CONSTRAINT `tiene_dias_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `peluquero` (`id_usuario`) ON DELETE CASCADE;

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
