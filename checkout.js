// js/checkout.js

async function checkout() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // Get logged-in user
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
        alert("Please login first");
        window.location.href = "log-in.html";
        return;
    }

    // Get products info
    const { data: products, error } = await supabaseClient
        .from("products")
        .select("*")
        .in("id", cart);

    if (error) {
        alert("Error loading products");
        console.error(error);
        return;
    }

    // Calculate quantities
    const quantities = {};
    cart.forEach(id => {
        quantities[id] = (quantities[id] || 0) + 1;
    });

    // Populate checkout page dynamically
    const container = document.getElementById("checkout-items");
    container.innerHTML = "";
    let total = 0;

    products.forEach(p => {
        const qty = quantities[p.id];
        total += p.price * qty;

        const itemDiv = document.createElement("div");
        itemDiv.className = "cart-item";
        itemDiv.innerHTML = `
            <img src="${p.image_url}" alt="${p.name}">
            <div class="cart-item-details">
                <h4>${p.name}</h4>
                <p>Price: KES ${p.price}</p>
                <p>Quantity: ${qty}</p>
            </div>
        `;
        container.appendChild(itemDiv);
    });

    document.getElementById("checkout-total").textContent = total;

    // Confirm and create order if user clicks Place Order
    const confirmOrder = confirm(`Your total is KES ${total}. Place order?`);
    if (!confirmOrder) return;

    // Create order
    const { data: order, error: orderError } = await supabaseClient
        .from("orders")
        .insert({
            user_id: user.id,
            total: total,
            status: "pending"
        })
        .select()
        .single();

    if (orderError) {
        alert("Error creating order");
        console.error(orderError);
        return;
    }

    // Create order items
    const items = products.map(p => ({
        order_id: order.id,
        product_id: p.id,
        quantity: quantities[p.id],
        price: p.price
    }));

    const { error: itemsError } = await supabaseClient
        .from("order_items")
        .insert(items);

    if (itemsError) {
        alert("Error saving order items");
        console.error(itemsError);
        return;
    }

    // Clear cart
    localStorage.removeItem("cart");

    alert("Order placed successfully!");
    window.location.href = "shop.html";
}

// Auto-populate checkout page on load
document.addEventListener("DOMContentLoaded", async () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) return;

    // Reuse checkout logic to display items without placing order
    await checkoutDisplay();
});

async function checkoutDisplay() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const { data: products } = await supabaseClient
        .from("products")
        .select("*")
        .in("id", cart);

    const quantities = {};
    cart.forEach(id => quantities[id] = (quantities[id] || 0) + 1);

    const container = document.getElementById("checkout-items");
    container.innerHTML = "";
    let total = 0;

    products.forEach(p => {
        const qty = quantities[p.id];
        total += p.price * qty;

        const itemDiv = document.createElement("div");
        itemDiv.className = "cart-item";
        itemDiv.innerHTML = `
            <img src="${p.image_url}" alt="${p.name}">
            <div class="cart-item-details">
                <h4>${p.name}</h4>
                <p>Price: KES ${p.price}</p>
                <p>Quantity: ${qty}</p>
            </div>
        `;
        container.appendChild(itemDiv);
    });

    document.getElementById("checkout-total").textContent = total;
}