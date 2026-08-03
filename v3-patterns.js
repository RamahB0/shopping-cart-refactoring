// ============================================================================
// ITERATION 3 - DESIGN PATTERNS APPLIED
// ============================================================================
// Building on the clean v2, this iteration introduces three design patterns:
//
//   1. STRATEGY  -> discount calculation. Each discount is its own strategy
//                   object, so we can add/swap discounts without touching the
//                   cart (Open/Closed Principle). Replaces the if/else chain.
//
//   2. OBSERVER  -> price-drop notifications. Customers "subscribe" to a
//                   product; when its price drops, all observers are notified
//                   automatically (loose coupling between product and users).
//
//   3. BUILDER   -> flexible creation of complex Product objects with many
//                   optional fields (category, tags, description...) via a
//                   readable, chainable API instead of a huge constructor.
//
// Run with: node v3-patterns.js
// ============================================================================


// ---------------------------------------------------------------------------
// 1) STRATEGY PATTERN - discount calculation
// ---------------------------------------------------------------------------
class DiscountStrategy {
  apply(subtotal) {
    return subtotal; // default: no discount
  }
}

class NoDiscount extends DiscountStrategy {
  apply(subtotal) {
    return subtotal;
  }
}

class PercentageDiscount extends DiscountStrategy {
  constructor(rate) {
    super();
    this.rate = rate;
  }
  apply(subtotal) {
    return subtotal - subtotal * this.rate;
  }
}

// Adding a new discount type never changes the cart - just add a strategy.
const DISCOUNTS = {
  NONE: new NoDiscount(),
  SAVE10: new PercentageDiscount(0.1),
  SAVE20: new PercentageDiscount(0.2),
  HALF: new PercentageDiscount(0.5),
};


// ---------------------------------------------------------------------------
// 2) OBSERVER PATTERN - notify customers about price drops
// ---------------------------------------------------------------------------
class Customer {
  constructor(name) {
    this.name = name;
  }
  // called by the subject (Product) when something changes
  update(product, oldPrice, newPrice) {
    console.log(
      `Hi ${this.name}! "${product.name}" dropped from ${oldPrice} to ${newPrice}.`
    );
  }
}


// ---------------------------------------------------------------------------
// 3) BUILDER PATTERN - construct complex Product objects step by step
// ---------------------------------------------------------------------------
class Product {
  constructor(builder) {
    this.name = builder.name;
    this.price = builder.price;
    this.category = builder.category;
    this.tags = builder.tags;
    this.description = builder.description;
    this.observers = []; // used by the Observer pattern
  }

  // --- Observer (subject) methods ---
  subscribe(customer) {
    this.observers.push(customer);
  }

  unsubscribe(customer) {
    this.observers = this.observers.filter((o) => o !== customer);
  }

  setPrice(newPrice) {
    const oldPrice = this.price;
    this.price = newPrice;
    if (newPrice < oldPrice) {
      this.observers.forEach((o) => o.update(this, oldPrice, newPrice));
    }
  }
}

class ProductBuilder {
  constructor(name, price) {
    this.name = name;
    this.price = price;
    this.category = "general";
    this.tags = [];
    this.description = "";
  }
  withCategory(category) {
    this.category = category;
    return this;
  }
  withTags(tags) {
    this.tags = tags;
    return this;
  }
  withDescription(description) {
    this.description = description;
    return this;
  }
  build() {
    return new Product(this);
  }
}


// ---------------------------------------------------------------------------
// The cart now depends on a DiscountStrategy instead of hard-coded branches.
// ---------------------------------------------------------------------------
class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(product, quantity) {
    this.items.push({ product, quantity });
    console.log(`${product.name} added`);
  }

  removeItem(productName) {
    this.items = this.items.filter((i) => i.product.name !== productName);
    console.log(`${productName} removed`);
  }

  getSubtotal() {
    return this.items.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0
    );
  }

  getTotal(strategy = DISCOUNTS.NONE) {
    return strategy.apply(this.getSubtotal());
  }

  print(strategy = DISCOUNTS.NONE) {
    console.log("---- CART ----");
    for (const i of this.items) {
      console.log(`${i.product.name} x${i.quantity} = ${i.product.price * i.quantity}`);
    }
    console.log(`Total: ${this.getTotal(strategy)}`);
  }
}


// ---------------------------------------------------------------------------
// DEMO - all three patterns working together
// ---------------------------------------------------------------------------
// Builder: create products with only the fields we care about.
const apple = new ProductBuilder("Apple", 1.5)
  .withCategory("Fruit")
  .withTags(["fresh", "organic"])
  .build();

const orange = new ProductBuilder("Orange", 2.0)
  .withCategory("Fruit")
  .build();

// Observer: a customer watches the apple for price drops.
const sara = new Customer("Sara");
apple.subscribe(sara);

const cart = new ShoppingCart();
cart.addItem(apple, 2);
cart.addItem(orange, 3);

// Strategy: choose the discount at runtime.
cart.print(DISCOUNTS.SAVE10);

// Trigger the observer by dropping the apple's price.
apple.setPrice(1.0); // -> Sara gets notified automatically

cart.print(DISCOUNTS.HALF);
