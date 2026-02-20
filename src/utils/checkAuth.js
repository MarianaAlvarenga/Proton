export const checkAuth = async () => {
  try {
<<<<<<< Updated upstream
    const response = await fetch('https://verde-holders-sequences-developers.trycloudflare.com/backend/actions/checkSession.php', {
=======
    const response = await fetch('https://verde-holders-sequences-developers.trycloudflare.com/backend/actions/checkSession.php', {
>>>>>>> Stashed changes
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
