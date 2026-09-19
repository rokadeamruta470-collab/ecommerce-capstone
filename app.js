const API_URL = "https://dummyjson.com/products";

const productContainer =
    document.getElementById("productContainer");

let allProducts = [];

async function loadProducts() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        const data = await response.json();

        allProducts = data.products.slice(0, 12);

        createControls();
        displayProducts(allProducts);

    } catch (error) {
        console.error(error);

        productContainer.innerHTML =
            "<p>Unable to load products.</p>";
    }
}

function createControls() {

    const searchInput = document.createElement("input");

    searchInput.type = "text";
    searchInput.placeholder = "Search products...";
    searchInput.id = "searchInput";

    const categoryFilter = document.createElement("select");

    categoryFilter.id = "categoryFilter";

    categoryFilter.innerHTML =
        '<option value="all">All Categories</option>';

    const categories = [
        ...new Set(
            allProducts.map(product => product.category)
        )
    ];

    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value = category;
        option.textContent = category;

        categoryFilter.appendChild(option);
    });

    productContainer.parentElement.insertBefore(
        categoryFilter,
        productContainer
    );

    productContainer.parentElement.insertBefore(
        searchInput,
        productContainer
    );

    searchInput.addEventListener(
        "input",
        filterProducts
    );

    categoryFilter.addEventListener(
        "change",
        filterProducts
    );
}

function displayProducts(products) {

    productContainer.innerHTML = "";

    if (products.length === 0) {

        productContainer.innerHTML =
            "<p>No products found.</p>";

        return;
    }

    products.forEach(product => {

        const card =
            document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <img
                src="${product.thumbnail}"
                alt="${product.title}"
            >

            <h3>${product.title}</h3>

            <p>${product.description}</p>

            <p class="price">
                $${product.price}
            </p>

            <p>
                Category: ${product.category}
            </p>

            <button>Add to Cart</button>
        `;

        productContainer.appendChild(card);
    });
}

function filterProducts() {

    const searchInput =
        document.getElementById("searchInput");

    const categoryFilter =
        document.getElementById("categoryFilter");

    const searchText =
        searchInput.value.toLowerCase();

    const selectedCategory =
        categoryFilter.value;

    const filteredProducts =
        allProducts.filter(product => {

            const matchesSearch =
                product.title
                    .toLowerCase()
                    .includes(searchText);

            const matchesCategory =
                selectedCategory === "all" ||
                product.category === selectedCategory;

            return matchesSearch &&
                   matchesCategory;
        });

    displayProducts(filteredProducts);
}

loadProducts();