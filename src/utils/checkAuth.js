export const checkAuth = async () => {
  try {
    const response = await fetch('https://von-portable-exec-istanbul.trycloudflare.com/backend/actions/checkSession.php', {
      method: 'GET',
      credentials: 'include', // MUY IMPORTANTE para que se envíe la cookie de sesión
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al verificar sesión:", error);
    return { authenticated: false };
  }
};
