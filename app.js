const API_URL = "https://dummyjson.com/products";

const productContainer = document.getElementById("productContainer");

async function loadProducts() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        const data = await response.json();

        productContainer.innerHTML = "";

        data.products.slice(0, 12).forEach(product => {
            const card = document.createElement("div");

            card.className = "product-card";

            card.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <p class="price">$${product.price}</p>
                <button>Add to Cart</button>
            `;

            productContainer.appendChild(card);
        });

    } catch (error) {
        console.error(error);

        productContainer.innerHTML =
            "<p>Unable to load products.</p>";
    }
}

loadProducts();
