// Add to Cart Functionality
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const productCard = this.closest('.pastry-card, .product-card');
        const product = {
            id: productCard.dataset.id,
            title: productCard.querySelector('.pastry-title, .product-title').textContent,
            price: productCard.querySelector('.pastry-price, .price').textContent,
            image: productCard.querySelector('.pastry-img, .product-image img').src,
            desc: productCard.querySelector('.pastry-desc, .product-desc').textContent
        };
        
        addToCart(product);
        showAddFeedback(this);
    });
});

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
}

function showAddFeedback(button) {
    const addText = button.querySelector('.add-text');
    const addedText = button.querySelector('.added-text');
    
    addText.style.display = 'none';
    addedText.style.display = 'inline';
    button.style.backgroundColor = '#4CAF50'; // Green success color
    
    setTimeout(() => {
        addText.style.display = 'inline';
        addedText.style.display = 'none';
        button.style.backgroundColor = '';
    }, 2000);
}
function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
        
        cart.forEach(item => {
            const price = parseFloat(item.price.replace('$', ''));
            const total = price * item.quantity;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <p class="item-desc">${item.desc}</p>
                    <div class="item-meta">
                        <span class="item-price">${item.price}</span>
                        <span class="item-quantity">× ${item.quantity}</span>
                        <span class="item-total">$${total.toFixed(2)}</span>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }
}