// SWAAD EXPRESS CART AND BILL LOGIC
// The cart is a plain object: { dishId: quantity }.

const MAX_PER_DISH = 99;

// "₹249" -> 249
function priceValue(price) {
  return Number(String(price).replace(/[^0-9.]/g, "")) || 0;
}

function addToCart(cart, id) {
  const qty = cart[id] || 0;
  if (qty < MAX_PER_DISH) cart[id] = qty + 1;
  return cart;
}

function changeQty(cart, id, delta) {
  const qty = (cart[id] || 0) + delta;
  if (qty <= 0) delete cart[id];
  else if (qty <= MAX_PER_DISH) cart[id] = qty;
  return cart;
}

// Turns the cart into rows: item, quantity, line total.
function cartLines(cart, menu) {
  return Object.entries(cart).map(([id, qty]) => {
    const dish = menu.find(item => item.id == id);
    const price = dish ? priceValue(dish.price) : 0;
    return {
      item: dish,
      qty,
      lineTotal: price * qty
    };
  });
}

function cartTotal(cart, menu) {
  const lines = cartLines(cart, menu);
  return lines.reduce((sum, line) => sum + line.lineTotal, 0);
}

// Calculates food total, 5% GST, and grand total for the bill
function billSummary(cart, menu) {
  const food = cartTotal(cart, menu);
  const gstRate = 0.05;
  const gst = Number((food * gstRate).toFixed(2));
  const total = Number((food + gst).toFixed(2));
  return {
    food,
    gstRate,
    gst,
    total
  };
}

if (typeof module !== "undefined") {
  module.exports = {
    MAX_PER_DISH,
    priceValue,
    addToCart,
    changeQty,
    cartLines,
    cartTotal,
    billSummary
  };
}
