// js/cart.js

async function loadCart() {
    const container = document.getElementById("cart-container");
    const totalElement = document.getElementById("cart-total");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        container.innerHTML = "<p style='text-align:center;'>Your cart is empty.</p>";
        totalElement.textContent = "0";
        return;
    }

    try {
        // Fetch products from Supabase
        const { data: products, error } = await supabaseClient
            .from('products')
            .select('*')
            .in('id', cart);

        if (error) {
            console.error(error);
            container.innerHTML = "<p>Error loading cart.</p>";
            return;
        }

        container.innerHTML = "";
        let total = 0;

        // Count quantities
        const quantities = {};
        cart.forEach(id => quantities[id] = (quantities[id] || 0) + 1);

        products.forEach(product => {
            const qty = quantities[product.id];
            total += product.price * qty;

            const div = document.createElement("div");
            div.className = "cart-item"; // matches updated CSS

            div.innerHTML = `
                <img src="${product.image_url}" alt="${product.name}">
                <div class="cart-item-details">
                    <h4>${product.name}</h4>
                    <p>Price: KES ${product.price}</p>
                    <div style="display:flex; align-items:center; gap:5px; margin-top:5px;">
                        <button onclick="updateQuantity(${product.id}, -1)" class="remove-btn">−</button>
                        <span>Quantity: ${qty}</span>
                        <button onclick="updateQuantity(${product.id}, 1)" class="btn">+</button>
                    </div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${product.id})">Remove</button>
            `;

            container.appendChild(div);
        });

        totalElement.textContent = total;

    } catch (err) {
        console.error("Cart error:", err);
    }
}

// Remove all instances of a product
function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(item => item !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

// Update quantity
function updateQuantity(id, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (change > 0) {
        cart.push(id);
    } else {
        const index = cart.indexOf(id);
        if (index > -1) cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

// Load cart on page load
document.addEventListener("DOMContentLoaded", loadCart);