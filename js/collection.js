// collection.js
document.addEventListener('DOMContentLoaded', () => {
    // Cart System
    let cart = JSON.parse(localStorage.getItem('lumiereCart')) || [];
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const checkoutBtn = document.querySelector('.checkout-btn');

    // Initialize 3D Viewer
    if (typeof init3DViewer === 'function') {
        init3DViewer();
    }

    // Add to Cart Functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.product-card');
            const product = {
                id: productCard.dataset.productId,
                name: productCard.querySelector('.product-title').textContent,
                price: parseFloat(productCard.querySelector('.product-price').textContent.replace('$', '')),
                image: productCard.querySelector('img').src,
                quantity: 1
            };

            const existingItem = cart.find(item => item.id === product.id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push(product);
            }

            updateCartDisplay();
            cartSidebar.classList.add('active');
            saveCartToStorage();
        });
    });

    // Update Cart Display
    function updateCartDisplay() {
        cartItemsContainer.innerHTML = '';
        let subtotal = 0;

        cart.forEach((item, index) => {
            subtotal += item.price * item.quantity;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="decrement" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increment" data-index="${index}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-index="${index}">&times;</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        updateTotals();
        updateCartCount();
    }

    // Quantity Controls
    cartItemsContainer.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        
        if (e.target.classList.contains('increment')) {
            cart[index].quantity++;
        } else if (e.target.classList.contains('decrement')) {
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1);
            }
        } else if (e.target.classList.contains('remove-item')) {
            cart.splice(index, 1);
        }

        updateCartDisplay();
        saveCartToStorage();
    });

    // Cart Toggle
    document.querySelector('.cart-btn').addEventListener('click', () => {
        cartSidebar.classList.toggle('active');
    });

    document.querySelector('.close-cart').addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });

    // Checkout Functionality
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }

            try {
                saveCartToStorage();
                window.location.href = 'checkout.html';
            } catch (error) {
                console.error('Checkout error:', error);
                alert('Error proceeding to checkout. Please try again.');
            }
        });
    }

    // Helper Functions
    function updateTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.10;
        const total = subtotal + tax;

        document.getElementById('subtotal').textContent = subtotal.toFixed(2);
        document.getElementById('tax').textContent = tax.toFixed(2);
        document.getElementById('total').textContent = total.toFixed(2);
    }

    function saveCartToStorage() {
        try {
            localStorage.setItem('lumiereCart', JSON.stringify(cart));
            updateCartCount();
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    function updateCartCount() {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = count;
        document.querySelectorAll('.cart-count').forEach(span => span.textContent = count);
    }

    // Initial Setup
    updateCartDisplay();
    updateCartCount();

    // 3D Viewer Initialization
    function init3DViewer() {
        // Your 3D viewer implementation
    }
});