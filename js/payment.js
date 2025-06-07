document.addEventListener('DOMContentLoaded', function() {
    // Load order summary (same as checkout.js)
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotalEl = document.getElementById('checkoutSubtotal');
    const totalEl = document.getElementById('checkoutTotal');
    
    let subtotal = 0;
    cart.forEach(item => {
        const price = parseFloat(item.price.replace('$', ''));
        subtotal += price * item.quantity;
    });
    
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    totalEl.textContent = `$${subtotal.toFixed(2)}`;
    
    // Payment method selection
    document.querySelectorAll('.method-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelector('.method-option.active').classList.remove('active');
            this.classList.add('active');
        });
    });
    
    // Form submission
    document.getElementById('paymentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Process payment here
        // Then redirect to confirmation:
        window.location.href = 'confirmation.html';
    });
});