// ============================================================================
// ITERATION 1 - STARTING POINT (intentionally messy / "bad" code)
// ============================================================================
// This is the rough version we begin with. It is deliberately full of code
// smells so we have something to refactor:
//   - global mutable state everywhere
//   - long function doing too many things (SRP violation)
//   - duplicated logic (totals calculated in several places)
//   - magic numbers and unclear names (a, b, x, tmp, arr)
//   - tight coupling between cart logic, discount logic, and printing
//   - dead / commented-out code left behind
// Run with: node v1-messy.js
// ============================================================================

var arr = [];               // the cart... "arr"
var t = 0;                  // some total
var d = 0;                  // discount amount?
// var oldTotal = 0;        // (dead code, not used anymore)

function add(a, b, c) {
  // a = name, b = qty, c = price  (unclear params)
  arr[arr.length] = { n: a, q: b, p: c };
  // recalc total here
  t = 0;
  for (var i = 0; i < arr.length; i++) {
    t = t + arr[i].q * arr[i].p;
  }
  console.log(a + " added");
}

function remove(a) {
  var tmp = [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].n != a) {
      tmp[tmp.length] = arr[i];
    }
  }
  arr = tmp;
  // recalc total AGAIN (duplicated logic)
  t = 0;
  for (var i = 0; i < arr.length; i++) {
    t = t + arr[i].q * arr[i].p;
  }
  console.log(a + " removed");
}

// giant function that prints, applies discount, and computes total all at once
function print(code) {
  console.log("---- CART ----");
  var x = 0;
  for (var i = 0; i < arr.length; i++) {
    console.log(arr[i].n + " x" + arr[i].q + " = " + arr[i].q * arr[i].p);
    x = x + arr[i].q * arr[i].p;   // yet another total calculation (duplication)
  }
  // discount handling with magic numbers and copy-pasted branches
  if (code == "SAVE10") {
    d = x * 0.1;
    x = x - d;
  } else if (code == "SAVE20") {
    d = x * 0.2;
    x = x - d;
  } else if (code == "HALF") {
    d = x * 0.5;
    x = x - d;
  }
  t = x;
  console.log("Total: " + t);
  // console.log("debug", oldTotal);   // leftover debug line (dead code)
}

// ----- usage -----
add("Apple", 2, 1.5);
add("Orange", 3, 2.0);
print("SAVE10");
remove("Apple");
print("HALF");
