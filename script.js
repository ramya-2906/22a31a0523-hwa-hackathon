const PRODUCT = {
  id: 'pph-1',
  name: 'PawPlay Haven Smart Puzzle Treat Station',
  price: 4999,
  image: 'https://images.unsplash.com/photo-1585110396000-9ff1a3c3b35d?w=500&q=80'
};

let cart = JSON.parse(localStorage.getItem('pph_cart')) || [];
let selectedColour = 'Orange';

const cartCountEl = document.getElementById('cart-count');
const cartItemsEl = document.getElementById('cart-items');
const cartEmptyEl = document.getElementById('cart-empty');
const subtotalEl = document.getElementById('summary-subtotal');
const totalEl = document.getElementById('summary-total');
const checkoutBtn = document.getElementById('btn-checkout');
const checkoutTotalEl = document.getElementById('checkout-total');
const selectedColourEl = document.getElementById('selected-colour');

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  if (cartCountEl) cartCountEl.textContent = count;
}

function saveCart() {
  localStorage.setItem('pph_cart', JSON.stringify(cart));
  updateCartCount();
}

function selectColour(el, colour) {
  selectedColour = colour;
  document.querySelectorAll('.swatch').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  if (selectedColourEl) selectedColourEl.textContent = 'Selected: ' + colour;
}

function addToCart() {
  const existing = cart.find(i => i.id === PRODUCT.id && i.colour === selectedColour);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: PRODUCT.id, name: PRODUCT.name, price: PRODUCT.price, colour: selectedColour, qty: 1 });
  }
  saveCart();
  renderCart();
  const btn = document.querySelector('.btn-cart');
  const original = btn.textContent;
  btn.textContent = 'Added!';
  setTimeout(() => btn.textContent = original, 1000);
}

function goToCheckout() {
  if (cart.length === 0) return;
  window.location.href = 'checkout.html';
}

function goHome() {
  window.location.href = 'index.html';
}

function changeQty(id, colour, delta) {
  const item = cart.find(i => i.id === id && i.colour === colour);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => !(i.id === id && i.colour === colour));
  }
  saveCart();
  renderCart();
}

function removeItem(id, colour) {
  cart = cart.filter(i => !(i.id === id && i.colour === colour));
  saveCart();
  renderCart();
}

function getSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function formatPrice(n) {
  return '&#8377; ' + n.toLocaleString('en-IN');
}

function renderCart() {
  if (!cartItemsEl) return;
  updateCartCount();
  cartItemsEl.innerHTML = '';
  if (cart.length === 0) {
    if (cartEmptyEl) cartEmptyEl.style.display = 'block';
    if (checkoutBtn) checkoutBtn.disabled = true;
    if (subtotalEl) subtotalEl.textContent = formatPrice(0);
    if (totalEl) totalEl.textContent = formatPrice(0);
    return;
  }
  if (cartEmptyEl) cartEmptyEl.style.display = 'none';
  if (checkoutBtn) checkoutBtn.disabled = false;
  let subtotal = 0;
  cart.forEach(item => {
    subtotal += item.price * item.qty;
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img src="${PRODUCT.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <div class="cart-item-title">${item.name}</div>
        <div class="cart-item-title" style="font-size:0.85rem;color:var(--text-light);margin-top:2px;">Colour: ${item.colour}</div>
        <div class="cart-item-price">${formatPrice(item.price)}</div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="changeQty('${item.id}','${item.colour}',-1)">&#8722;</button>
        <span class="qty-value">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty('${item.id}','${item.colour}',1)">&#43;</button>
        <button class="remove-btn" onclick="removeItem('${item.id}','${item.colour}')">&times;</button>
      </div>
    `;
    cartItemsEl.appendChild(el);
  });
  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (totalEl) totalEl.textContent = formatPrice(subtotal);
  if (checkoutTotalEl) checkoutTotalEl.textContent = formatPrice(subtotal);
}

document.addEventListener('DOMContentLoaded', () => {
  const navMobile = document.getElementById('nav-mobile');
  const navLinks = document.querySelector('.nav-links');
  if (navMobile && navLinks) {
    navMobile.addEventListener('click', () => navLinks.classList.toggle('open'));
  }
  renderCart();

  const form = document.getElementById('checkout-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const orderId = 'PPH-' + Math.floor(100000 + Math.random() * 900000);
      localStorage.setItem('pph_last_order', orderId);
      window.location.href = 'success.html';
    });
  }
});