// js/products.js
async function loadProducts() {
    try {
        const { data, error } = await supabaseClient
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase error:', error);
            return;
        }

        console.log('Fetched products:', data);

        const container = document.getElementById("products-container");
        container.innerHTML = "";

        data.forEach(p => {
            const div = document.createElement("div");
            div.className = "product-card";

            const img = document.createElement("img");
            img.src = p.image_url; // directly assign URL
            img.alt = p.name;
            img.width = 200;
            img.onerror = () => console.error("Failed to load image:", p.image_url);

            const h3 = document.createElement("h3");
            h3.textContent = p.name;

            const price = document.createElement("p");
            price.textContent = `KES ${p.price}`;

            const details = document.createElement("p");
            details.textContent = `Size: ${p.size} | Condition: ${p.condition}`;

            const btn = document.createElement("button");
            btn.textContent = "Add to Cart";
            btn.onclick = () => addToCart(p.id);

            div.appendChild(img);
            div.appendChild(h3);
            div.appendChild(price);
            div.appendChild(details);
            div.appendChild(btn);

            container.appendChild(div);
        });

    } catch (err) {
        console.error("Unexpected error:", err);
    }
}

document.addEventListener("DOMContentLoaded", loadProducts);

function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(id);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
}