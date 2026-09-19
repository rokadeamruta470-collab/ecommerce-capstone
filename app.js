const API_URL = "https://dummyjson.com/products";

const productContainer =
    document.getElementById("productContainer");

const adminProductContainer =
    document.getElementById("adminProductContainer");

let allProducts = [];

let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

let savedProducts =
    JSON.parse(localStorage.getItem("products")) || [];


// ============================
// LOGIN
// ============================

const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");

loginForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const username =
            document.getElementById("username").value;

        const password =
            document.getElementById("password").value;

        if (username && password) {

            localStorage.setItem(
                "loggedInUser",
                username
            );

            loginMessage.textContent =
                `Welcome, ${username}! Login successful.`;

            loginForm.reset();

        } else {

            loginMessage.textContent =
                "Please enter username and password.";
        }
    }
);


// ============================
// LOAD PRODUCTS
// ============================

async function loadProducts() {

    try {

        const response =
            await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                "Failed to load products"
            );
        }

        const data =
            await response.json();


        if (savedProducts.length > 0) {

            allProducts =
                savedProducts;

        } else {

            allProducts =
                data.products.slice(0, 12);

            saveProducts();
        }


        createControls();

        displayProducts(allProducts);

        displayCart();

        displayAdminProducts();

    } catch (error) {

        console.error(error);

        productContainer.innerHTML =
            "<p>Unable to load products.</p>";
    }
}


// ============================
// SAVE PRODUCTS
// ============================

function saveProducts() {

    localStorage.setItem(
        "products",
        JSON.stringify(allProducts)
    );
}


// ============================
// SEARCH / FILTER / SORT
// ============================

function createControls() {

    const searchInput =
        document.createElement("input");

    searchInput.type = "text";

    searchInput.placeholder =
        "Search products...";

    searchInput.id =
        "searchInput";


    const categoryFilter =
        document.createElement("select");

    categoryFilter.id =
        "categoryFilter";

    categoryFilter.innerHTML =
        '<option value="all">All Categories</option>';


    const categories = [
        ...new Set(
            allProducts.map(
                product => product.category
            )
        )
    ];


    categories.forEach(category => {

        const option =
            document.createElement("option");

        option.value = category;

        option.textContent = category;

        categoryFilter.appendChild(option);
    });


    const sortSelect =
        document.createElement("select");

    sortSelect.id =
        "sortSelect";

    sortSelect.innerHTML = `
        <option value="default">
            Sort By
        </option>

        <option value="low">
            Price: Low to High
        </option>

        <option value="high">
            Price: High to Low
        </option>
    `;


    productContainer.parentElement.insertBefore(
        searchInput,
        productContainer
    );

    productContainer.parentElement.insertBefore(
        categoryFilter,
        productContainer
    );

    productContainer.parentElement.insertBefore(
        sortSelect,
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

    sortSelect.addEventListener(
        "change",
        filterProducts
    );
}


// ============================
// DISPLAY PRODUCTS
// ============================

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

        card.className =
            "product-card";


        card.innerHTML = `
            <img
                src="${product.thumbnail}"
                alt="${product.title}"
            >

            <h3>${product.title}</h3>

            <p>
                ${product.description || ""}
            </p>

            <p class="price">
                $${product.price}
            </p>

            <p>
                Category: ${product.category}
            </p>

            <button
                onclick="addToCart(${product.id})">

                Add to Cart

            </button>
        `;


        productContainer.appendChild(card);
    });
}


// ============================
// FILTER PRODUCTS
// ============================

function filterProducts() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    const categoryFilter =
        document.getElementById(
            "categoryFilter"
        );

    const sortSelect =
        document.getElementById(
            "sortSelect"
        );


    const searchText =
        searchInput.value.toLowerCase();

    const selectedCategory =
        categoryFilter.value;

    const sortValue =
        sortSelect.value;


    let filteredProducts =
        allProducts.filter(product => {

            const matchesSearch =
                product.title
                    .toLowerCase()
                    .includes(searchText);

            const matchesCategory =
                selectedCategory === "all" ||
                product.category ===
                    selectedCategory;

            return (
                matchesSearch &&
                matchesCategory
            );
        });


    if (sortValue === "low") {

        filteredProducts.sort(
            (a, b) =>
                a.price - b.price
        );
    }


    if (sortValue === "high") {

        filteredProducts.sort(
            (a, b) =>
                b.price - a.price
        );
    }


    displayProducts(
        filteredProducts
    );
}


// ============================
// ADD TO CART
// ============================

function addToCart(productId) {

    const existingItem =
        cart.find(
            item => item.id === productId
        );


    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            id: productId,
            quantity: 1
        });
    }


    saveCart();

    displayCart();

    alert(
        "Product added to cart!"
    );
}


// ============================
// SAVE CART
// ============================

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
}


// ============================
// DISPLAY CART
// ============================

function displayCart() {

    const cartContainer =
        document.getElementById(
            "cartContainer"
        );

    const cartTotal =
        document.getElementById(
            "cartTotal"
        );


    if (!cartContainer ||
        !cartTotal) {

        return;
    }


    cartContainer.innerHTML = "";


    if (cart.length === 0) {

        cartContainer.innerHTML =
            "<p>Your cart is empty.</p>";

        cartTotal.textContent =
            "Total: $0.00";

        return;
    }


    let total = 0;


    cart.forEach(item => {

        const product =
            allProducts.find(
                product =>
                    product.id === item.id
            );


        if (!product) {
            return;
        }


        const itemTotal =
            product.price *
            item.quantity;


        total += itemTotal;


        const cartItem =
            document.createElement("div");

        cartItem.className =
            "product-card";


        cartItem.innerHTML = `
            <h3>
                ${product.title}
            </h3>

            <p>
                Price: $${product.price}
            </p>

            <p>
                Quantity: ${item.quantity}
            </p>

            <p>
                Item Total:
                $${itemTotal.toFixed(2)}
            </p>

            <button
                onclick="removeFromCart(${product.id})">

                Remove

            </button>
        `;


        cartContainer.appendChild(
            cartItem
        );
    });


    cartTotal.textContent =
        `Total: $${total.toFixed(2)}`;
}


// ============================
// REMOVE FROM CART
// ============================

function removeFromCart(productId) {

    cart =
        cart.filter(
            item => item.id !== productId
        );


    saveCart();

    displayCart();
}


// ============================
// ADD PRODUCT
// ============================

const productForm =
    document.getElementById(
        "productForm"
    );


productForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const title =
            document.getElementById(
                "productTitle"
            ).value;


        const price =
            Number(
                document.getElementById(
                    "productPrice"
                ).value
            );


        const category =
            document.getElementById(
                "productCategory"
            ).value;


        const image =
            document.getElementById(
                "productImage"
            ).value;


        const newProduct = {

            id: Date.now(),

            title: title,

            price: price,

            category: category,

            thumbnail: image,

            description:
                "Custom product added by admin."
        };


        allProducts.push(
            newProduct
        );


        saveProducts();

        displayProducts(
            allProducts
        );

        displayAdminProducts();

        productForm.reset();


        alert(
            "Product added successfully!"
        );
    }
);


// ============================
// DISPLAY ADMIN PRODUCTS
// ============================

function displayAdminProducts() {

    adminProductContainer.innerHTML = "";


    allProducts.forEach(product => {

        const item =
            document.createElement("div");

        item.className =
            "product-card";


        item.innerHTML = `
            <h3>
                ${product.title}
            </h3>

            <p>
                Price: $${product.price}
            </p>

            <p>
                Category: ${product.category}
            </p>

            <button
                onclick="editProduct(${product.id})">

                Edit

            </button>

            <button
                onclick="deleteProduct(${product.id})">

                Delete

            </button>
        `;


        adminProductContainer.appendChild(
            item
        );
    });
}


// ============================
// EDIT PRODUCT
// ============================

function editProduct(productId) {

    const product =
        allProducts.find(
            product =>
                product.id === productId
        );


    if (!product) {
        return;
    }


    const newTitle =
        prompt(
            "Enter new product name:",
            product.title
        );


    if (newTitle === null) {
        return;
    }


    const newPrice =
        prompt(
            "Enter new price:",
            product.price
        );


    if (newPrice === null) {
        return;
    }


    product.title =
        newTitle;

    product.price =
        Number(newPrice);


    saveProducts();

    displayProducts(
        allProducts
    );

    displayAdminProducts();

    displayCart();


    alert(
        "Product updated successfully!"
    );
}


// ============================
// DELETE PRODUCT
// ============================

function deleteProduct(productId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmDelete) {
        return;
    }


    allProducts =
        allProducts.filter(
            product =>
                product.id !== productId
        );


    cart =
        cart.filter(
            item =>
                item.id !== productId
        );


    saveProducts();

    saveCart();

    displayProducts(
        allProducts
    );

    displayAdminProducts();

    displayCart();


    alert(
        "Product deleted successfully!"
    );
}


// ============================
// START APPLICATION
// ============================

loadProducts();