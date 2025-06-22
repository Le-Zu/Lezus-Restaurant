let openShopping = document.querySelectorAll('.shopping');
let closeShopping = document.querySelector('.closeShopping');
let list = document.querySelector('.list');
let listCard = document.querySelector('.listCart');
let body = document.querySelector('body');
let total = document.querySelector('.total');
let quantitySpans = document.querySelectorAll('.cart-count');
let cart = document.querySelector('.cart');
let clearCartButton = document.querySelector('.clear-cart-btn'); // Select the new clear cart button

// Function to open the cart
openShopping.forEach(icon => {
    icon.addEventListener('click', () => {
        body.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// Function to close the cart
closeShopping.addEventListener('click', () => {
    body.classList.remove('active');
    document.body.style.overflow = '';
});

// Add a click listener directly to the cart to stop propagation for internal clicks
cart.addEventListener('click', (event) => {
    event.stopPropagation();
});

// Add event listener to close cart when clicking outside, but not when clicking "Add To Cart" or inside the cart itself
document.addEventListener('click', (event) => {
    // 1. If the cart is not active, there's nothing to close. Exit early.
    if (!body.classList.contains('active')) {
        return;
    }

    // 2. If the click was on the 'openShopping' icon, do NOT close the cart. Exit early.
    // We need to check if the clicked target or any of its ancestors is one of the openShopping icons
    if (Array.from(openShopping).some(icon => icon.contains(event.target))) {
        return;
    }

    // 3. If the click was on an "Add To Cart" button or anywhere within a product item (.item),
    // do NOT close the cart. Exit early.
    if (event.target.closest('.item')) {
        return;
    }

    // 4. If none of the above conditions were met AND the click was outside the cart, close the cart.
    // The cart.contains(event.target) check is handled by the cart's own listener.
    if (!cart.contains(event.target)) {
        body.classList.remove('active');
        document.body.style.overflow = '';
    }
});


let products = [
    {
        id: 1,
        name: 'Empanadas',
        image: 'empanadas.png',
        price: 3
    },
    {
        id: 2,
        name: 'Gimbap',
        image: 'gimbap.png',
        price: 3
    },
    {
        id: 3,
        name: 'Fried Chicken',
        image: 'fried_chicken.png',
        price: 8
    },
    {
        id: 4,
        name: 'Pad Thai',
        image: 'pad_thai.png',
        price: 15
    },
    {
        id: 5,
        name: 'Ramen',
        image: 'ramen.png',
        price: 15
    },
    {
        id: 6,
        name: 'Bugolgi',
        image: 'bugolgi.png',
        price: 15
    }
];
let listCarts = [];

function initApp() {
    products.forEach((value, key) => {
        let newDiv = document.createElement('div');
        newDiv.classList.add('item');
        newDiv.innerHTML = `
            <img src="images/${value.image}">
            <div class="title">${value.name}</div>
            <div class="price">$${value.price.toLocaleString()}.00</div>
            <button class="add-to-cart-btn" onclick="addToCart(${key})">Add To Cart</button>`;
        list.appendChild(newDiv);
    })
}
initApp();

function addToCart(key) {

    document.body.style.overflow = 'hidden';

    if (listCarts[key] == null) {
        listCarts[key] = JSON.parse(JSON.stringify(products[key]));
        listCarts[key].quantity = 1;
    } else {
        listCarts[key].quantity++;
    }
    listCarts[key].price = listCarts[key].quantity * products[key].price;
    reloadCard();
}


function reloadCard() {
    listCard.innerHTML = '';
    let count = 0;
    let totalPrice = 0;

    listCarts.forEach((value, key) => {
        if (value != null) {
            totalPrice = totalPrice + value.price;
            count = count + value.quantity;
            let newDiv = document.createElement('li');
            newDiv.innerHTML = `
                <div><img src="images/${value.image}"/></div>
                <div>$${(products[key].price).toLocaleString()}.00</div>
                <div></div>
                <div>
                    <button onclick="changeQuantity(${key}, ${value.quantity - 1})">-</button>
                    <div class="count">${value.quantity}</div>
                    <button onclick="changeQuantity(${key}, ${value.quantity + 1})">+</button>
                </div>`;
            listCard.appendChild(newDiv);
        }
    })
    total.innerText = 'Total: ' + '$' + totalPrice.toLocaleString() + '.00';
    quantitySpans.forEach(span => {
        span.innerText = count;
    });

    // Update "Nothing in cart" message
    const emptyCartMessage = document.querySelector('.cart h3');
    if (count === 0) {
        emptyCartMessage.style.display = 'block';
    } else {
        emptyCartMessage.style.display = 'none';
    }
}

function changeQuantity(key, newQuantity) {
    if (newQuantity <= 0) {
        delete listCarts[key];
    } else {
        listCarts[key].quantity = newQuantity;
        listCarts[key].price = newQuantity * products[key].price;

    }
    reloadCard();
}

// Function to clear the cart
function clearCart() {
    listCarts = []; // Reset the cart array to empty
    reloadCard(); // Update the display
    document.body.style.overflow = ''; // Re-enable scrolling
}

// Event listener for the "Clear Cart" button
clearCartButton.addEventListener('click', clearCart);