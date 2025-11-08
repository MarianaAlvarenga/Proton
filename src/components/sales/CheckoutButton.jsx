// CheckoutButton.jsx
export default function CheckoutButton() {
  const handleCheckout = async () => {
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
