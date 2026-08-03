# Shopping Cart System - Iterative Refactoring

An exercise in turning a deliberately **messy** shopping cart into a **clean,
modular, and maintainable** codebase through small, iterative steps - applying
refactoring techniques, clean-code principles, and three design patterns
(**Strategy**, **Observer**, **Builder**).

The work follows an Agile-like loop: **Refactor -> Test -> Add Pattern -> Test -> Repeat.**

## Iterations

| File | Iteration | Focus |
| --- | --- | --- |
| `v1-messy.js` | 1 - Starting point | Intentionally bad code full of smells (global state, long functions, duplication, magic numbers, dead code). |
| `v2-refactored.js` | 2 - Clean refactor | Encapsulation, intention-revealing names, DRY, extracted methods, separated concerns, dead code removed. |
| `v3-patterns.js` | 3 - Design patterns | Strategy (discounts), Observer (price drops), Builder (product creation). |

## How to Run

Each version is standalone and prints to the console:

```bash
node v1-messy.js
node v2-refactored.js
node v3-patterns.js
```

Because behavior is preserved between iterations, you can run each file after a
change to confirm it still works (test frequently).

## Code Smells Identified in v1

- **Global mutable state** (`arr`, `t`, `d`) shared and mutated everywhere.
- **Duplicated logic** - the subtotal was recomputed in three different places.
- **Long function** - `print()` printed, applied discounts, and computed totals all at once (violating the Single Responsibility Principle).
- **Magic numbers and unclear names** - `0.1`, `0.5`, `a`, `b`, `x`, `tmp`.
- **Tight coupling** between cart, discount, and presentation logic.
- **Dead code** - leftover commented-out lines.

## Patterns Applied in v3

- **Strategy** - each discount is its own object implementing a common `apply()` method. The cart depends on the abstraction, so new discounts can be added without modifying the cart (Open/Closed Principle). This replaced the if/else chain.
- **Observer** - a `Product` is a subject that customers subscribe to; when its price drops, every subscribed customer is notified automatically, keeping product and customers loosely coupled.
- **Builder** - `ProductBuilder` creates complex `Product` objects through a readable, chainable API (`.withCategory().withTags().build()`) instead of a large, hard-to-read constructor.

---

## Summary Report

**What changed and why.**
The first iteration was intentionally messy so there was something concrete to
improve. In iteration 2 the global variables were wrapped in a `ShoppingCart`
class to encapsulate state; cryptic names were renamed to reveal intent; the
three duplicated total-calculation loops were collapsed into a single
`getSubtotal()` method (DRY); the discount branches were extracted out of the
oversized `print()` function; and dead code was deleted. Iteration 3 then
introduced patterns exactly where the design was still weak: discounts, price
notifications, and product creation.

**How clean-code principles were followed.**
Each function now does one thing (Single Responsibility). Names describe intent
(`unitPrice`, `getSubtotal`, `PercentageDiscount`) so the code reads like prose.
Duplication was removed so behavior lives in one place. Magic numbers became
named strategies. Changes were made in small steps, keeping the program runnable
and testable after every step.

**How the patterns improved the design.**
Strategy made discounts open for extension but closed for modification - adding a
new discount no longer risks breaking the cart. Observer decoupled products from
the customers watching them, so notification logic lives outside the cart and new
subscriber types are trivial to add. Builder made constructing feature-rich
products readable and flexible without a telescoping constructor. Together they
reduced coupling, increased cohesion, and made the system far easier to extend
and maintain than the original v1.
