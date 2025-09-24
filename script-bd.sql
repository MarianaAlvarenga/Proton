-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3307
-- Tiempo de generación: 20-09-2025 a las 03:02:57
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
(36, '2025-03-18', '23:58:43', NULL, NULL, 2, 2800.00, 13),
(44, '2025-03-24', '13:15:19', 17, 31, NULL, 33.00, NULL),
(45, '2025-03-24', '13:15:30', NULL, 31, NULL, 33.00, 15),
(46, '2025-03-26', '00:12:27', 21, NULL, 2, 33.00, NULL),
(47, '2025-04-24', '02:06:04', NULL, NULL, 2, 2415.00, 16),
(48, '2025-04-24', '02:06:36', NULL, NULL, 2, 0.00, 17),
(49, '2025-04-24', '02:13:01', 32, NULL, NULL, 54.00, NULL),
(50, '2025-04-24', '02:14:59', 32, NULL, NULL, 54.00, NULL),
(52, '2025-04-24', '02:30:17', 32, 33, NULL, 21.00, NULL),
(53, '2025-05-17', '15:13:30', NULL, NULL, 2, 7832.00, 18),
(54, '2025-08-05', '23:11:33', 3, NULL, 2, 10008.00, NULL),
(55, '2025-08-05', '23:15:29', NULL, NULL, 2, 21.00, 19),
(56, '2025-08-06', '00:02:02', 3, 28, NULL, 54.00, NULL),
(57, '2025-08-06', '00:08:02', 21, NULL, NULL, 6007.00, NULL);

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
(3),
(17),
(21),
(32);

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
(680, '2025-09-21'),
(681, '2025-09-22'),
(682, '2025-09-23'),
(683, '2025-09-24'),
(684, '2025-09-25'),
(685, '2025-09-26'),
(696, '2025-09-20'),
(697, '2025-09-19');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dias_horas_disponibles`
--

CREATE TABLE `dias_horas_disponibles` (
  `id_dias_disponibles` int(11) NOT NULL,
  `id_horario_disponible` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `dias_horas_disponibles`
--

INSERT INTO `dias_horas_disponibles` (`id_dias_disponibles`, `id_horario_disponible`) VALUES
(680, 44),
(680, 74),
(680, 75),
(681, 44),
(681, 74),
(681, 75),
(682, 44),
(682, 74),
(682, 75),
(683, 44),
(684, 44),
(685, 44),
(696, 54),
(696, 63),
(696, 65),
(696, 66),
(696, 67),
(696, 68),
(696, 71),
(696, 73),
(696, 77),
(697, 66),
(697, 68),
(697, 69),
(697, 71),
(697, 73);

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
(39, '06:00:00', '06:30:00'),
(43, '06:30:00', '11:00:00'),
(44, '06:00:00', '09:30:00'),
(45, '08:00:00', '08:30:00'),
(49, '13:30:00', '14:00:00'),
(52, '11:00:00', '12:00:00'),
(54, '13:30:00', '14:30:00'),
(55, '14:30:00', '15:30:00'),
(63, '09:00:00', '10:00:00'),
(65, '11:30:00', '12:30:00'),
(66, '14:30:00', '15:00:00'),
(67, '15:00:00', '15:30:00'),
(68, '19:00:00', '20:00:00'),
(69, '20:00:00', '21:00:00'),
(71, '16:00:00', '17:00:00'),
(73, '18:00:00', '19:00:00'),
(74, '21:00:00', '22:00:00'),
(75, '22:00:00', '22:30:00'),
(77, '20:00:00', '20:30:00');

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
  `detalle` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mascota`
--

INSERT INTO `mascota` (`id_mascota`, `id_usuario`, `nombre_mascota`, `fecha_nacimiento`, `raza`, `peso`, `tamanio`, `largo_pelo`, `especie`, `sexo`, `color`, `detalle`) VALUES
(1, 30, 'proton', '2025-03-19', 'salchi', 25.00, '130', 'corto', NULL, NULL, NULL, NULL),
(3, 30, 'Caribe', '2025-04-17', 'siames', 10.00, 'mediano', 'largo', NULL, NULL, NULL, NULL);

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
(10),
(23),
(24),
(27);

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
(462, 'El Chocolatin misterioso super', 'riquísimo, pero no para perros ni gatos. capaz par', 1462, 1, 6, 2800.00, 'http://localhost:8080/Proton/backend/uploads/679ba8467ed3b_bepis.png'),
(887, 'ffafaf', 'daSDAs', 301, 2, 4, 33.00, 'http://localhost:8080/Proton/backend/uploads/674268d267223_accesorio1.png'),
(2223, 'wewewwww', 'holi, te estoy modificando', 3212, 2, 1, 21.00, 'http://localhost:8080/Proton/backend/uploads/6742632ceb56f_alimento1.png'),
(2467, '4341251', 'asdasd', 241, 3, 4, 232.00, NULL),
(7778, 'cazabobos', 'sss', 1498, 20, 5, 5986.00, 'http://localhost:8080/Proton/backend/uploads/67d9cfde72b91_tfc.png'),
(7779, 'cachafaz', 'alfajorcinho', 100, 20, 6, 2500.00, 'http://localhost:8080/Proton/backend/uploads/67d9d6e14c96a_VTV turno.png'),
(7780, 'debe ser por el muchacho este ', 'seguramente', 150, 10, 1, 6337.00, 'http://localhost:8080/Proton/backend/uploads/67d9d859ceaf1_Sin título.png'),
(7781, 'hmghmghmghmfh', 'hgmfmfghmfhgm', 444, 3, 2, 14.00, 'http://localhost:8080/Proton/backend/uploads/6809c728e0a8b_ChatGPT Image 5 abr 2025, 09_25_25 p.m..png'),
(7782, 'cscs', 'sdsds', 232, 2, 2, 232.00, NULL),
(7783, 'Universo Tangente', 'Universo Universal papá', 995, 10, 4, 200.00, 'http://localhost:8080/Proton/backend/uploads/6892b75e42907_universo tangente 1.png'),
(7784, 'sds', 'dsds', 23, 12, 1, 2.00, 'http://localhost:8080/Proton/backend/uploads/6892b7a722c51_philly.png'),
(7785, 'Portadeishon', 'a que no usaste IA xd', 5, 1, 1, 1.00, 'http://localhost:8080/Proton/backend/uploads/6892b7ffcb3c7_portada.png'),
(7786, 'Agregame uno más', 'uhuh uhuh', 2000, 12, 2, 300.00, NULL),
(7787, 'Avena', 'calma, nutrición y restauración', 1200, 10, 3, 300.00, NULL),
(7788, 'SQL', 'managament', 1500, 20, 4, 200.00, 'http://localhost:8080/Proton/backend/uploads/6892b8540627f_3a7259ca-3246-435f-b1cb-0f006ab1c738.png'),
(7789, 'Ultimeishon', 'eso espero', 1500, 20, 5, 200.00, 'http://localhost:8080/Proton/backend/uploads/6892b86d53a73_VTV turno.png'),
(7790, 'dwdw', 'dwdw', 1, 1, 2, 1.00, NULL);

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

--
-- Volcado de datos para la tabla `tiene_dias`
--

INSERT INTO `tiene_dias` (`id_usuario`, `id_dias_disponibles`) VALUES
(27, 680),
(27, 681),
(27, 682),
(27, 683),
(27, 684),
(27, 685),
(27, 696),
(27, 697);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_servicio`
--

CREATE TABLE `tipo_servicio` (
  `id_tipo` int(11) NOT NULL,
  `id_servicio` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL
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

--
-- Volcado de datos para la tabla `turno`
--

INSERT INTO `turno` (`id_turno`, `fecha`, `hora_inicio`, `hora_fin`, `cliente_id`, `id_usuario`, `id_peluquero`) VALUES
(32, '2025-09-19', '06:00:00', '06:30:00', 0, NULL, 27),
(33, '2025-09-19', '12:00:00', '12:30:00', 0, NULL, 27),
(34, '2025-09-19', '11:30:00', '12:00:00', 0, NULL, 27),
(35, '2025-09-19', '11:00:00', '11:30:00', 0, NULL, 27),
(36, '2025-09-19', '11:00:00', '11:30:00', 0, NULL, 27),
(37, '2025-09-19', '06:00:00', '06:30:00', 0, NULL, 27),
(38, '2025-09-19', '12:00:00', '12:30:00', 0, NULL, 27),
(39, '2025-09-19', '11:30:00', '12:00:00', 0, NULL, 27),
(40, '2025-09-19', '11:00:00', '11:30:00', 0, NULL, 27),
(41, '2025-09-19', '06:30:00', '11:00:00', 0, NULL, 27),
(42, '2025-09-19', '06:30:00', '11:00:00', 0, NULL, 27),
(43, '2025-09-21', '06:00:00', '09:30:00', 0, NULL, 27),
(44, '2025-09-22', '06:00:00', '09:30:00', 0, NULL, 27),
(45, '2025-09-23', '06:00:00', '09:30:00', 0, NULL, 27),
(46, '2025-09-24', '06:00:00', '09:30:00', 0, NULL, 27),
(47, '2025-09-25', '06:00:00', '09:30:00', 0, NULL, 27),
(48, '2025-09-26', '06:00:00', '09:30:00', 0, NULL, 27),
(49, '2025-09-19', '08:00:00', '08:30:00', 0, NULL, 27),
(50, '2025-09-19', '08:00:00', '08:30:00', 0, NULL, 27),
(51, '2025-09-21', '06:00:00', '09:30:00', 0, NULL, 27),
(52, '2025-09-22', '06:00:00', '09:30:00', 0, NULL, 27),
(53, '2025-09-23', '06:00:00', '09:30:00', 0, NULL, 27),
(54, '2025-09-24', '06:00:00', '09:30:00', 0, NULL, 27),
(55, '2025-09-25', '06:00:00', '09:30:00', 0, NULL, 27),
(56, '2025-09-26', '06:00:00', '09:30:00', 0, NULL, 27),
(57, '2025-09-19', '09:00:00', '09:30:00', 0, NULL, 27),
(60, '2025-09-20', '13:30:00', '14:00:00', 0, NULL, 27),
(61, '2025-09-20', '13:30:00', '14:00:00', 0, NULL, 27),
(63, '2025-09-21', '06:00:00', '09:30:00', 0, NULL, 27),
(64, '2025-09-22', '06:00:00', '09:30:00', 0, NULL, 27),
(65, '2025-09-23', '06:00:00', '09:30:00', 0, NULL, 27),
(66, '2025-09-24', '06:00:00', '09:30:00', 0, NULL, 27),
(67, '2025-09-25', '06:00:00', '09:30:00', 0, NULL, 27),
(68, '2025-09-26', '06:00:00', '09:30:00', 0, NULL, 27),
(73, '2025-09-21', '06:00:00', '09:30:00', 0, NULL, 27),
(74, '2025-09-22', '06:00:00', '09:30:00', 0, NULL, 27),
(75, '2025-09-23', '06:00:00', '09:30:00', 0, NULL, 27),
(76, '2025-09-24', '06:00:00', '09:30:00', 0, NULL, 27),
(77, '2025-09-25', '06:00:00', '09:30:00', 0, NULL, 27),
(78, '2025-09-26', '06:00:00', '09:30:00', 0, NULL, 27),
(81, '2025-09-20', '11:00:00', '12:00:00', 0, NULL, 27),
(83, '2025-09-20', '13:30:00', '14:30:00', 0, NULL, 27),
(84, '2025-09-20', '13:30:00', '14:30:00', 0, NULL, 27),
(86, '2025-09-21', '06:00:00', '09:30:00', 0, NULL, 27),
(87, '2025-09-22', '06:00:00', '09:30:00', 0, NULL, 27),
(88, '2025-09-23', '06:00:00', '09:30:00', 0, NULL, 27),
(89, '2025-09-24', '06:00:00', '09:30:00', 0, NULL, 27),
(90, '2025-09-25', '06:00:00', '09:30:00', 0, NULL, 27),
(91, '2025-09-26', '06:00:00', '09:30:00', 0, NULL, 27),
(98, '2025-09-21', '06:00:00', '09:30:00', 0, NULL, 27),
(99, '2025-09-22', '06:00:00', '09:30:00', 0, NULL, 27),
(100, '2025-09-23', '06:00:00', '09:30:00', 0, NULL, 27),
(101, '2025-09-24', '06:00:00', '09:30:00', 0, NULL, 27),
(102, '2025-09-25', '06:00:00', '09:30:00', 0, NULL, 27),
(103, '2025-09-26', '06:00:00', '09:30:00', 0, NULL, 27),
(109, '2025-09-21', '06:00:00', '09:30:00', 0, NULL, 27),
(110, '2025-09-22', '06:00:00', '09:30:00', 0, NULL, 27),
(111, '2025-09-23', '06:00:00', '09:30:00', 0, NULL, 27),
(112, '2025-09-24', '06:00:00', '09:30:00', 0, NULL, 27),
(113, '2025-09-25', '06:00:00', '09:30:00', 0, NULL, 27),
(114, '2025-09-26', '06:00:00', '09:30:00', 0, NULL, 27),
(115, '2025-09-26', '06:00:00', '09:30:00', 0, NULL, 27),
(117, '2025-09-21', '06:00:00', '09:30:00', 0, NULL, 27),
(118, '2025-09-22', '06:00:00', '09:30:00', 0, NULL, 27),
(119, '2025-09-23', '06:00:00', '09:30:00', 0, NULL, 27),
(120, '2025-09-24', '06:00:00', '09:30:00', 0, NULL, 27),
(121, '2025-09-25', '06:00:00', '09:30:00', 0, NULL, 27),
(122, '2025-09-26', '06:00:00', '09:30:00', 0, NULL, 27),
(123, '2025-09-26', '06:00:00', '09:30:00', 0, NULL, 27),
(124, '2025-09-21', '06:00:00', '09:30:00', 0, NULL, 27),
(125, '2025-09-22', '06:00:00', '09:30:00', 0, NULL, 27),
(126, '2025-09-23', '06:00:00', '09:30:00', 0, NULL, 27),
(127, '2025-09-24', '06:00:00', '09:30:00', 0, NULL, 27),
(128, '2025-09-25', '06:00:00', '09:30:00', 0, NULL, 27),
(129, '2025-09-26', '06:00:00', '09:30:00', 0, NULL, 27),
(130, '2025-09-26', '06:00:00', '09:30:00', 0, NULL, 27),
(131, '2025-09-21', '06:00:00', '09:30:00', 0, NULL, 27),
(132, '2025-09-22', '06:00:00', '09:30:00', 0, NULL, 27),
(133, '2025-09-23', '06:00:00', '09:30:00', 0, NULL, 27),
(134, '2025-09-24', '06:00:00', '09:30:00', 0, NULL, 27),
(135, '2025-09-25', '06:00:00', '09:30:00', 0, NULL, 27),
(136, '2025-09-26', '06:00:00', '09:30:00', 0, NULL, 27),
(139, '2025-09-20', '09:00:00', '10:00:00', 0, NULL, 27),
(141, '2025-09-20', '11:30:00', '12:30:00', 0, NULL, 27),
(143, '2025-09-20', '13:30:00', '14:30:00', 0, NULL, 27),
(144, '2025-09-20', '14:30:00', '15:00:00', 0, NULL, 27),
(145, '2025-09-20', '15:00:00', '15:30:00', 0, NULL, 27),
(146, '2025-09-19', '19:00:00', '20:00:00', 0, NULL, 27),
(147, '2025-09-19', '20:00:00', '21:00:00', 0, NULL, 27),
(149, '2025-09-19', '16:00:00', '17:00:00', 0, NULL, 27),
(151, '2025-09-19', '18:00:00', '19:00:00', 0, NULL, 27),
(152, '2025-09-21', '21:00:00', '22:00:00', 0, NULL, 27),
(153, '2025-09-21', '21:00:00', '22:00:00', 0, NULL, 27),
(155, '2025-09-19', '16:00:00', '17:00:00', 0, NULL, 27),
(156, '2025-09-19', '18:00:00', '19:00:00', 0, NULL, 27),
(157, '2025-09-19', '19:00:00', '20:00:00', 0, NULL, 27),
(158, '2025-09-19', '20:00:00', '21:00:00', 0, NULL, 27),
(160, '2025-09-20', '09:00:00', '10:00:00', 0, NULL, 27),
(161, '2025-09-20', '11:30:00', '12:30:00', 0, NULL, 27),
(163, '2025-09-20', '13:30:00', '14:30:00', 0, NULL, 27),
(164, '2025-09-20', '14:30:00', '15:00:00', 0, NULL, 27),
(165, '2025-09-20', '15:00:00', '15:30:00', 0, NULL, 27),
(166, '2025-09-21', '06:00:00', '09:30:00', 0, NULL, 27),
(167, '2025-09-22', '21:00:00', '22:00:00', 0, NULL, 27),
(168, '2025-09-22', '22:00:00', '22:30:00', 0, NULL, 27),
(169, '2025-09-22', '06:00:00', '09:30:00', 0, NULL, 27),
(170, '2025-09-23', '06:00:00', '09:30:00', 0, NULL, 27),
(171, '2025-09-24', '06:00:00', '09:30:00', 0, NULL, 27),
(172, '2025-09-25', '06:00:00', '09:30:00', 0, NULL, 27),
(173, '2025-09-26', '06:00:00', '09:30:00', 0, NULL, 27),
(174, '2025-09-20', '16:00:00', '17:00:00', 0, NULL, 27),
(176, '2025-09-20', '18:00:00', '19:00:00', 0, NULL, 27),
(177, '2025-09-20', '19:00:00', '20:00:00', 0, NULL, 27),
(178, '2025-09-20', '19:00:00', '20:00:00', 0, NULL, 27),
(179, '2025-09-19', '16:00:00', '17:00:00', 0, NULL, 27),
(180, '2025-09-19', '18:00:00', '19:00:00', 0, NULL, 27),
(181, '2025-09-19', '19:00:00', '20:00:00', 0, NULL, 27),
(182, '2025-09-19', '20:00:00', '21:00:00', 0, NULL, 27),
(183, '2025-09-20', '09:00:00', '10:00:00', 0, NULL, 27),
(184, '2025-09-20', '11:30:00', '12:30:00', 0, NULL, 27),
(185, '2025-09-20', '13:30:00', '14:30:00', 0, NULL, 27),
(186, '2025-09-20', '14:30:00', '15:00:00', 0, NULL, 27),
(187, '2025-09-20', '15:00:00', '15:30:00', 0, NULL, 27),
(188, '2025-09-20', '16:00:00', '17:00:00', 0, NULL, 27),
(189, '2025-09-20', '18:00:00', '19:00:00', 0, NULL, 27),
(190, '2025-09-20', '19:00:00', '20:00:00', 0, NULL, 27),
(191, '2025-09-20', '20:00:00', '20:30:00', 0, NULL, 27),
(192, '2025-09-21', '06:00:00', '09:30:00', 0, NULL, 27),
(193, '2025-09-22', '21:00:00', '22:00:00', 0, NULL, 27),
(194, '2025-09-22', '22:00:00', '22:30:00', 0, NULL, 27),
(195, '2025-09-22', '06:00:00', '09:30:00', 0, NULL, 27),
(196, '2025-09-23', '21:00:00', '22:00:00', 0, NULL, 27),
(197, '2025-09-23', '22:00:00', '22:30:00', 0, NULL, 27),
(198, '2025-09-23', '06:00:00', '09:30:00', 0, NULL, 27),
(199, '2025-09-24', '06:00:00', '09:30:00', 0, NULL, 27),
(200, '2025-09-25', '06:00:00', '09:30:00', 0, NULL, 27),
(201, '2025-09-26', '06:00:00', '09:30:00', 0, NULL, 27),
(202, '2025-09-26', '06:00:00', '09:30:00', 0, NULL, 27);

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
(2, 'Lol', 'Istrador', '123456789', 'lol@lol.com', '$2y$10$Dc544k5adRVrzIBHVcW5qui.461915YUAh.9rPwNkqCJrgGtvUCWu', 4, '2025-08-02', '6892b543ed202.png'),
(3, 'Gasti Lindof', 'García', '1541724146', 'gaston.garcia89@hotmail.com', '$2y$10$GvC7G1ZgJ2lRNb5wesayoeYAGJrh/h5mgzmLT3zKLt3cDBg3DtaPW', 1, NULL, '68ae338416220.png'),
(10, 'peluca', 'sabe un montonazo', '646452', 'peluca@sabe.com', '$2y$10$vhrLY/3Jtd.s97g.uXPb0OQX35IE.AIuXTkZ9gTuwLJL.527MfaDW', 3, NULL, NULL),
(17, 'wwfff', 'asda', '1511124122', 'gaston.garcqqia89@hotmail.com', '$2y$10$ZMxWQgaKY89M2LTPyFd3YuLpn/Rt812.ikRVoBY0aYYUDTGRZNo7S', 1, NULL, NULL),
(21, 'proti', 'bonito y lindo', '13264579', 'pro@pro', '$2y$10$fgZKZbZlr6j78WTZEBYx8ehyp3besbwuvF.nZDj1En2o2FqbC/.ZK', 1, NULL, NULL),
(23, 'marulinda', 'afedafas', '232', 'asfasf@s.com', '$2y$10$6.RsshUzbPnEA26bpnJY.u0m3bg4wRd.804v0CGplt6NFv/LnPFFC', 3, NULL, NULL),
(24, 'pepito', 'clavo un clavito', '111221', 'pepito@pepito.com', '$2y$10$BWuTSKevGIduSY5ABjE7veMkH0ircujZQTdbjF7iET31b432Es4pa', 3, NULL, NULL),
(27, 'peluca', 'peluca', '123', 'peluca@peluca.com', '$2y$10$M52DxHfuitvMyookIcFAPOdFjBLUhRA1K2DWqjpD2l3DeZm9wt3f.', 3, '2025-08-30', '68941a9ca58ba.png'),
(28, 'venduca', 'venduca', '321654', 'venduca@venduca.com', '$2y$10$Q1Kyh0ntgdlUzAarxPgPL.uUAN5FgtIL.ifvdk/hk8MRGDMMSFt8a', 2, '2025-08-30', '689419ff24df1.png'),
(29, 'fff', 'fff', '55', 'fafaf@rrr.com', '$2y$10$lT5m54Al9pEzjcQsg.dAye.xRHWnhrlWzdjGWbWW0MbvjtFftsF.e', 4, NULL, NULL),
(31, 'lol3', 'fadsda', '2332', 'lol3@lol3.com', '$2y$10$nI1ZYyRwPrya2Hm3Gf5zYuS8QD7Mxx1kB1e4s2CVfAX3CTxfMvpw6', 2, NULL, NULL),
(32, '1', '1', '1', '1@1.com', '$2y$10$VsfSCjbuLxgt5jY.a6U5t.L6nvOnD1rbsl3clzZ5eb984WkcdayEG', 1, NULL, '68ab7332d41cc.png'),
(33, '2', '2', '2', '2@2.com', '$2y$10$VuRKzeEDF6ueCXSERR76BOQ4vMTpOslwSGF2fD0oIPCPRFmC1hp4.', 2, NULL, NULL),
(35, 'Pruebita imagen', 'papurri', '123', 'prueba@p', '$2y$10$3df8NnqjJf2s82DpJXaLXeoiH64XBQCWhIgnq9fbJ3t9UfYZ19/.S', 2, NULL, NULL);

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
(1, 13),
(2, 14),
(3, 15),
(4, 16),
(5, 17),
(6, 18),
(7, 19),
(13, 36),
(15, 45),
(16, 47),
(17, 48),
(18, 53),
(19, 55);

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
(28),
(31),
(33),
(35);

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
  ADD PRIMARY KEY (`id_mascota`);

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
-- Indices de la tabla `tipo_servicio`
--
ALTER TABLE `tipo_servicio`
  ADD PRIMARY KEY (`id_tipo`),
  ADD KEY `id_servicio` (`id_servicio`);

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
  MODIFY `id_carrito` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `dias_disponibles`
--
ALTER TABLE `dias_disponibles`
  MODIFY `id_dias_disponibles` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=698;

--
-- AUTO_INCREMENT de la tabla `horas_disponibles`
--
ALTER TABLE `horas_disponibles`
  MODIFY `id_horario_disponible` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT de la tabla `mascota`
--
ALTER TABLE `mascota`
  MODIFY `id_mascota` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `codigo_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7791;

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
-- AUTO_INCREMENT de la tabla `tipo_servicio`
--
ALTER TABLE `tipo_servicio`
  MODIFY `id_tipo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `turno`
--
ALTER TABLE `turno`
  MODIFY `id_turno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=203;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT de la tabla `usuario_no_registrado`
--
ALTER TABLE `usuario_no_registrado`
  MODIFY `id_usuario_no_registrado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Restricciones para tablas volcadas
--

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
  ADD CONSTRAINT `cliente_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `dias_horas_disponibles`
--
ALTER TABLE `dias_horas_disponibles`
  ADD CONSTRAINT `dias_horas_disponibles_ibfk_1` FOREIGN KEY (`id_dias_disponibles`) REFERENCES `dias_disponibles` (`id_dias_disponibles`) ON DELETE CASCADE,
  ADD CONSTRAINT `dias_horas_disponibles_ibfk_2` FOREIGN KEY (`id_horario_disponible`) REFERENCES `horas_disponibles` (`id_horario_disponible`) ON DELETE CASCADE;

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
-- Filtros para la tabla `tipo_servicio`
--
ALTER TABLE `tipo_servicio`
  ADD CONSTRAINT `tipo_servicio_ibfk_1` FOREIGN KEY (`id_servicio`) REFERENCES `servicio` (`id_servicio`) ON DELETE CASCADE ON UPDATE CASCADE;

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
