<?php
// Redirige al frontend luego del pago.
// Agregamos "?mp=ok" para evitar problemas de aislamiento del navegador.
header("Location: http://localhost:3000/success?mp=ok");
exit;
