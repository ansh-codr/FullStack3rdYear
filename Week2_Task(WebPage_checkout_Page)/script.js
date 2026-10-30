var products = [
    { id: 1, name: "Wireless Headphones", price: 49.99, quantity: 1 },
    { id: 2, name: "Laptop Stand", price: 29.99, quantity: 2 },
    { id: 3, name: "USB-C Cable", price: 12.99, quantity: 1 }
];
var suggestedProducts = [
    { id: 4, name: "Wireless Mouse", price: 24.99 },
    { id: 5, name: "Desk Mat", price: 15.99 }
];
var discount = 0;
var productsBox = document.getElementById("products");
var suggestedBox = document.getElementById("suggested");

function showProducts() {
    productsBox.innerHTML = "";
    if (products.length === 0) productsBox.innerHTML = "<p>Your cart is empty.</p>";
    products.forEach(function (product) {
        var item = document.createElement("div");
        item.className = "product";
        item.innerHTML = "<div class=\"productName\"><b>" + product.name + "</b><span>$" + product.price.toFixed(2) + " each</span></div><div class=\"quantity\"><button onclick=\"changeQuantity(" + product.id + ",-1)\">-</button><span>" + product.quantity + "</span><button onclick=\"changeQuantity(" + product.id + ",1)\">+</button></div><b class=\"price\">$" + (product.price * product.quantity).toFixed(2) + "</b><button class=\"removeButton\" onclick=\"removeProduct(" + product.id + ")\">Remove</button>";
        productsBox.appendChild(item);
    });
}

function showSuggested() {
    suggestedBox.innerHTML = "";
    suggestedProducts.forEach(function (product) {
        var item = document.createElement("div");
        item.className = "suggested";
        item.innerHTML = "<span>" + product.name + " - $" + product.price.toFixed(2) + "</span><button class=\"addButton\" onclick=\"addProduct(" + product.id + ")\">Add</button>";
        suggestedBox.appendChild(item);
    });
}

function changeQuantity(id, value) {
    products.forEach(function (product) {
        if (product.id === id) product.quantity += value;
    });
    products = products.filter(function (product) { return product.quantity > 0 });
    showProducts();
    showSummary();
}

function removeProduct(id) {
    products = products.filter(function (product) { return product.id !== id });
    showProducts();
    showSummary();
}

function addProduct(id) {
    var product = suggestedProducts.find(function (item) { return item.id === id });
    var already = products.find(function (item) { return item.id === id });
    if (already) already.quantity++;
    else products.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
    suggestedProducts = suggestedProducts.filter(function (item) { return item.id !== id });
    showProducts();
    showSuggested();
    showSummary();
}

function showSummary() {
    var subtotal = 0;
    products.forEach(function (product) { subtotal += product.price * product.quantity });
    var delivery = subtotal === 0 ? 0 : 5;
    var discountAmount = subtotal * discount;
    var total = subtotal - discountAmount + delivery;
    document.getElementById("subtotal").textContent = "$" + subtotal.toFixed(2);
    document.getElementById("discount").textContent = "-$" + discountAmount.toFixed(2);
    document.getElementById("delivery").textContent = "$" + delivery.toFixed(2);
    document.getElementById("total").textContent = "$" + total.toFixed(2);
}

document.getElementById("apply").onclick = function () {
    var code = document.getElementById("coupon").value.toUpperCase();
    var message = document.getElementById("message");
    if (code === "SAVE100") {
        discount = 1;
        message.textContent = "100% discount applied.";
    } else {
        discount = 0;
        message.textContent = "Invalid discount code.";
    }
    showSummary();
};

showProducts();
showSuggested();
showSummary();
