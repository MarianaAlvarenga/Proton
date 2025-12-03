// CheckoutButton.jsx
export default function CheckoutButton() {

  const handleCheckout = async () => {

    // --------------------------------------------------
    // 🔥 BACKUP EXPRESS PARA EVITAR PÉRDIDA DE SESIÓN
    // --------------------------------------------------
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const total = localStorage.getItem("total") || 0;
    const currentUserId = localStorage.getItem("currentUserId") || null;
    const currentUserRole = localStorage.getItem("currentUserRole") || null;
    const email = localStorage.getItem("email") || null;
    const isRegistered = localStorage.getItem("isRegistered") || false;

    document.cookie = `cart_backup=${encodeURIComponent(JSON.stringify(cart))}; path=/;`;
    document.cookie = `total_backup=${total}; path=/;`;
    document.cookie = `currentUserId_backup=${currentUserId}; path=/;`;
    document.cookie = `currentUserRole_backup=${currentUserRole}; path=/;`;
    document.cookie = `email_backup=${email}; path=/;`;
    document.cookie = `isRegistered_backup=${isRegistered}; path=/;`;
    // --------------------------------------------------


    // 🔵 Llamada normal al backend
    const res = await fetch("/api/create_preference.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [
          { title: "Shampoo antipulgas", quantity: 1, unit_price: 1500.5, currency_id: "ARS" }
        ]
      })
    });

    const data = await res.json();
    window.location.href = data.sandbox_init_point || data.init_point;
  };

  return <button onClick={handleCheckout}>Pagar con MercadoPago</button>;
}
