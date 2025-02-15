const products = [
    { id: 1, name: "NKN CV Joint (Mitsubishi Xpander 2017-2021)", price: 7000, description: "Description of Product 1", image: "images/4-NKN_70e8f571-5b9d-4a19-8051-b132333ffeb3_750x.webp" },
    { id: 2, name: "Product 2", price: 3000, description: "Description of Product 2", image: "images/5-NKN_9bdbeb86-d52a-400e-ae3e-8e223080fcf9.webp" }
];
let cart = [];

// Load cart from localStorage if available
function loadCart() {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartCount();
        updateCartDisplay();
    }
}

// Function to render products on the homepage
function renderProducts() {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ''; // Clear the current content

    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("col-md-4", "mb-4");
        productCard.innerHTML = `
            <div class="card product-card">
                <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">Price: ${product.price} tk</p>
                </div>
            </div>
        `;
        productCard.querySelector('.card').addEventListener('click', () => viewProduct(product.id));
        productList.appendChild(productCard);
    });
}

// Function to view a product detail page
function viewProduct(id) {
    const product = products.find(p => p.id === id);
    const mainContent = document.getElementById("main-content");

    // Clear current content to show product details
    mainContent.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <img src="${product.image}" class="img-fluid" alt="${product.name}">
            </div>
            <div class="col-md-6">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p>Price: ${product.price} tk</p>
                <label for="quantity-${product.id}">Quantity: </label>
                <input type="number" id="quantity-${product.id}" value="1" min="1" class="form-control w-25 mb-3">
                <button class="btn btn-success" onclick="addToCart(${product.id})">Add to Cart</button>
                <button class="btn btn-secondary mt-3" id="back-to-products">Back to Products</button>
            </div>
        </div>
    `;

    // Add event listener for the back button
    document.getElementById('back-to-products').addEventListener('click', renderProducts);
}

// Function to add product to cart
function addToCart(id) {
    const product = products.find(p => p.id === id);
    const quantityInput = document.getElementById(`quantity-${id}`);
    const quantity = parseInt(quantityInput.value);
    for (let i = 0; i < quantity; i++) {
        cart.push(product);
    }
    updateCartCount();
    updateCartDisplay();
    saveCart();
    alert("Product added to cart!");
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Update the cart count in the navbar
function updateCartCount() {
    document.getElementById("cart-count").innerText = cart.length;
}

// Display cart items in modal
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById("cart-items");
    const clearCartButton = document.getElementById("clear-cart");
    cartItemsContainer.innerHTML = "";
    let total = 0;
    const cartSummary = {};

    cart.forEach(item => {
        if (cartSummary[item.id]) {
            cartSummary[item.id].quantity += 1;
        } else {
            cartSummary[item.id] = { ...item, quantity: 1 };
        }
    });

    if (Object.keys(cartSummary).length > 0) {
        clearCartButton.style.display = "block";
    } else {
        clearCartButton.style.display = "none";
    }

    Object.values(cartSummary).forEach(item => {
        total += item.price * item.quantity;
        const itemDiv = document.createElement("div");
        itemDiv.innerHTML = `<p>${item.name} x ${item.quantity} - ${item.price * item.quantity } tk</p>`;
        cartItemsContainer.appendChild(itemDiv);
    });
    document.getElementById("total-price").innerText = total.toFixed(2);
}

document.getElementById("view-cart").addEventListener("click", () => {
    $('#cart-modal').modal('show');
});

document.getElementById("clear-cart").addEventListener("click", () => {
    cart = [];
    updateCartCount();
    updateCartDisplay();
    saveCart();
});

// Search functionality (button click event)
document.getElementById("search-button").addEventListener("click", () => {
    const searchQuery = document.getElementById("search-box").value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery)
    );
    renderFilteredProducts(filteredProducts);
});

// Render filtered products after search
function renderFilteredProducts(filteredProducts) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ''; // Clear the current content

    if (filteredProducts.length === 0) {
        productList.innerHTML = '<p>No products found</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("col-md-4", "mb-4");
        productCard.innerHTML = `
            <div class="card product-card">
                <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">Price: $${product.price}</p>
                </div>
            </div>
        `;
        productCard.querySelector('.card').addEventListener('click', () => viewProduct(product.id));
        productList.appendChild(productCard);
    });
}

// Load products and cart on page load
loadCart();
renderProducts();