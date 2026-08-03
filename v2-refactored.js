// ============================================================================
// ITERATION 2 - REFACTORED (clean structure, no patterns yet)
// ============================================================================
// Changes made in this iteration and why:
//   - Replaced global mutable state with a ShoppingCart class (encapsulation).
//   - Renamed cryptic variables (arr, t, d, a/b/c, x, tmp) to intention-
//     revealing names (items, name, quantity, unitPrice, subtotal...).
//   - Removed duplicated total calculation: a single getSubtotal() method is
//     now the one source of truth (DRY).
//   - Extracted the discount logic into its own function (Extract Method),
//     replacing copy-pasted if/else branches and magic numbers with a table.
//   - Separated concerns: cart operations vs. discount vs. printing are no
//     longer tangled inside one giant function (SRP).
//   - Deleted dead/commented-out code.
// Behavior is unchanged, so the code stays runnable after refactoring.
// Run with: node v2-refactored.js
// ============================================================================

// Discount rates kept in one place instead of magic numbers scattered around.
const DISCOUNT_RATES = {
  SAVE10: 0.1,
  SAVE20: 0.2,
  HALF: 0.5,
};

function getDiscountRate(code) {
  return DISCOUNT_RATES[code] || 0;
}

class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(name, quantity, unitPrice) {
    this.items.push({ name, quantity, unitPrice });
    console.log(`${name} added`);
  }

  removeItem(name) {
    this.items = this.items.filter((item) => item.name !== name);
    console.log(`${name} removed`);
  }

  // Single source of truth for the subtotal (no more duplicated loops).
  getSubtotal() {
    return this.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
  }

  getTotal(discountCode) {
    const subtotal = this.getSubtotal();
    const discount = subtotal * getDiscountRate(discountCode);
    return subtotal - discount;
  }

  // Printing is now ONLY about presentation, nothing else.
  print(discountCode) {
    console.log("---- CART ----");
    for (const item of this.items) {
      console.log(`${item.name} x${item.quantity} = ${item.quantity * item.unitPrice}`);
    }
    console.log(`Total: ${this.getTotal(discountCode)}`);
  }
}

// ----- usage (same behavior as v1) -----
const cart = new ShoppingCart();
cart.addItem("Apple", 2, 1.5);
cart.addItem("Orange", 3, 2.0);
cart.print("SAVE10");
cart.removeItem("Apple");
cart.print("HALF");
