document.addEventListener('DOMContentLoaded', () => {
    // Load cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cartItems');
    const checkoutSubtotal = document.getElementById('checkoutSubtotal');
    const checkoutTax = document.getElementById('checkoutTax');
    const checkoutTotal = document.getElementById('checkoutTotal');
    const paymentCards = document.querySelectorAll('.payment-card');
    const confirmationModal = document.getElementById('confirmationModal');

    // Populate cart items
    function populateCart() {
        cartItemsContainer.innerHTML = '';
        let subtotal = 0;

        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item-checkout';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <p>Quantity: ${item.quantity}</p>
                    <p>$${(item.price * item.quantity).toFixed(2)}</p>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        const tax = subtotal * 0.10;
        const total = subtotal + tax + 5.00;

        checkoutSubtotal.textContent = subtotal.toFixed(2);
        checkoutTax.textContent = tax.toFixed(2);
        checkoutTotal.textContent = total.toFixed(2);
    }

    // Payment method selection
    paymentCards.forEach(card => {
        card.addEventListener('click', () => {
            paymentCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });

    // Form submission
    document.getElementById('checkoutForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Clear cart
        localStorage.removeItem('cart');
        document.querySelector('.cart-count').textContent = '0';
        
        // Show confirmation modal
        confirmationModal.style.display = 'flex';
        
        // Redirect after 5 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 5000);
    });

    // Close modal on outside click
    confirmationModal.addEventListener('click', (e) => {
        if (e.target === confirmationModal) {
            confirmationModal.style.display = 'none';
        }
    });

    // Initial population
    populateCart();
});
// Add to checkout.js
// 3D Viewer with Three.js
function init3DViewer() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(400, 400);
    document.getElementById('productViewer').appendChild(renderer.domElement);

    // Add product model
    const loader = new THREE.GLTFLoader();
    loader.load('models/croissant.glb', function(gltf) {
        scene.add(gltf.scene);
    });

    camera.position.z = 5;
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();
}

// Product Customization
document.querySelectorAll('.flavor-card').forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('selected');
    });
});

// Gift Wrapping Interactions
document.getElementById('giftWrapping').addEventListener('change', (e) => {
    document.querySelector('.gift-options').style.display = e.target.checked ? 'block' : 'none';
    updateTotals();
});

// Loyalty Points Redemption
document.querySelector('.apply-points').addEventListener('click', () => {
    const points = document.querySelector('.points-redemption input').value;
    const discount = points * 0.1; // $0.10 per point
    applyDiscount(discount);
});

// Delivery Time Selection
document.querySelectorAll('.time-card').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.time-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        if(card.dataset.time === 'schedule') {
            document.getElementById('deliveryTime').showPicker();
        }
    });
});

// Initialize 3D Viewer
if(WebGL.isWebGLAvailable()) {
    init3DViewer();
} else {
    document.getElementById('productViewer').innerHTML = '<p>3D viewer not supported</p>';
}
// personalization.js
document.addEventListener('DOMContentLoaded', () => {
    // Flavor Selection
    const flavorCards = document.querySelectorAll('.flavor-card');
    let selectedFlavor = null;

    flavorCards.forEach(card => {
        card.addEventListener('click', () => {
            // Remove previous selection
            if(selectedFlavor) selectedFlavor.classList.remove('selected');
            
            // Add floating animation
            card.style.transform = 'translateY(-5px)';
            setTimeout(() => {
                card.style.transform = 'translateY(0)';
            }, 200);

            // Update selection
            card.classList.add('selected');
            selectedFlavor = card;
            updateFlavorPreview(card.dataset.flavor);
        });
    });

    // Message Customization
    const messageInput = document.querySelector('.designer-input');
    const charCounter = document.querySelector('.current-count');
    const previewText = document.querySelector('.calligraphed-preview');

    messageInput.addEventListener('input', (e) => {
        const text = e.target.value;
        const length = text.length;
        
        // Update preview with animation
        previewText.style.opacity = '0';
        setTimeout(() => {
            previewText.textContent = text || '"Your Message"';
            previewText.style.opacity = '1';
        }, 200);

        // Update character counter
        charCounter.textContent = length;
        charCounter.style.color = length >= 40 ? '#ff4757' : '#888';
    });

    // Font Selection
    const fontOptions = document.querySelectorAll('.font-option');
    fontOptions.forEach(option => {
        option.addEventListener('click', () => {
            fontOptions.forEach(f => f.classList.remove('active'));
            option.classList.add('active');
            
            // Apply font to preview
            const fontClass = `font-${option.dataset.font}`;
            previewText.className = `calligraphed-preview ${fontClass}`;
            
            // Add transition effect
            previewText.style.animation = 'fadeIn 0.3s ease';
            setTimeout(() => {
                previewText.style.animation = '';
            }, 300);
        });
    });

    // Decoration Selection
    const decorationCards = document.querySelectorAll('.decoration-card');
    decorationCards.forEach(card => {
        card.addEventListener('click', () => {
            decorationCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            // Update decoration preview
            const decoration = card.dataset.decoration;
            updateDecorationPreview(decoration);
        });
    });

    // Preview Updaters
    function updateFlavorPreview(flavor) {
        const previewSection = document.querySelector('.product-preview');
        previewSection.dataset.flavor = flavor;
        // Add flavor-specific animation
        previewSection.style.animation = 'flavorChange 0.5s ease';
        setTimeout(() => {
            previewSection.style.animation = '';
        }, 500);
    }

    function updateDecorationPreview(decoration) {
        const previewImage = document.querySelector('.decoration-preview');
        previewImage.style.backgroundImage = `url('decorations/${decoration}.png')`;
        
        // Add sparkle animation
        const sparkles = document.createElement('div');
        sparkles.className = 'sparkle-animation';
        previewImage.appendChild(sparkles);
        setTimeout(() => sparkles.remove(), 1000);
    }
});
// Gift Interactions
document.getElementById('giftWrapping').addEventListener('change', function(e) {
    const giftOptions = document.querySelector('.gift-options-wrapper');
    const previewBox = document.querySelector('.package-preview');
    
    if(e.target.checked) {
        giftOptions.style.display = 'block';
        previewBox.style.animation = 'packageReveal 0.5s ease';
    } else {
        giftOptions.style.display = 'none';
    }
});

document.querySelectorAll('.ribbon-card').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.ribbon-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const color = card.dataset.color;
        document.querySelector('.selected-ribbon').style.background = color;
        document.querySelector('.selected-ribbon').style.opacity = '1';
    });
});

document.querySelector('.luxury-textarea').addEventListener('input', function(e) {
    const message = e.target.value;
    document.querySelector('.gift-message-preview').textContent = message;
    document.querySelector('.gift-message-preview').style.opacity = message ? '1' : '0';
});

// Delivery Time Interactions
document.querySelector('.custom-time-display').addEventListener('click', () => {
    document.getElementById('deluxeTime').showPicker();
});

document.getElementById('deluxeTime').addEventListener('change', function(e) {
    const date = new Date(e.target.value);
    const options = { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    document.querySelector('.selected-date').textContent = 
        date.toLocaleDateString('en-US', options);
});

// Initialize flatpickr for better styling
flatpickr("#deluxeTime", {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    minDate: "today",
    time_24hr: false,
    locale: {
        firstDayOfWeek: 1
    }
});
// Initialize cart count on page load
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(span => {
        span.textContent = count;
    });
}

// Call this on every page load
document.addEventListener('DOMContentLoaded', updateCartCount);
document.getElementById('checkoutForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Clear cart after successful checkout
    localStorage.removeItem('cart');
    
    // Update cart count
    updateCartCount();
    
    // Show confirmation modal
    confirmationModal.style.display = 'flex';
    
    // Redirect after delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 5000);
});
// Add at the start of checkout.js
if (cart.length === 0) {
    document.querySelector('.checkout-container').innerHTML = `
        <div class="empty-cart">
            <i class="fas fa-shopping-basket"></i>
            <h2>Your Cart is Empty</h2>
            <p>Please add items from our collection</p>
            <a href="collection.html" class="return-btn">
                Browse Collection
            </a>
        </div>
    `;
    return;
}
// Add this at the top of checkout.js
document.addEventListener('DOMContentLoaded', () => {
    // Retrieve cart from localStorage
    let cart;
    try {
        cart = JSON.parse(localStorage.getItem('lumiereCart')) || [];
        console.log('Loaded cart:', cart);
    } catch (error) {
        console.error('Cart load error:', error);
        cart = [];
    }
    
    // Rest of your checkout code...
});