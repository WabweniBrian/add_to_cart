// FUNCTION:: Get elements by id
const el = (elm) => document.getElementById(elm);
// FUNCTION:: Get elements by queryselector
const qs = (elm) => document.querySelector(elm);
// FUNCTION:: Get elements by queryselectorAll
const qsa = (elm) => document.querySelectorAll(elm);

// Get all DOM elements
const [
  launchBtn,
  cartModal,
  cartDialog,
  closeIcon,
  filterBtnList,
  productList,
  cartList,
] = [
  qs(".launch-btn"),
  qs(".cart-modal"),
  qs(".cart-dialog"),
  qs(".close-icon"),
  qs(".filter-btns"),
  qs(".product-grid"),
  qs(".cart-items-list"),
];

// -------------------------------------------------------------------------CART MODAL----------------------------------------------------------------------------------------

// Launch the modal by adding the open class
launchBtn.addEventListener("click", (e) => {
  cartModal.classList.add("open");
  cartDialog.classList.add("open");
});

// FUNCTION: Close the modal by removing the open class
function closeModal(element) {
  element.addEventListener("click", (e) => {
    cartModal.classList.remove("open");
    cartDialog.classList.remove("open");
  });
}

closeModal(closeIcon);

// Close the modal when user clicks outside the modal dialog
window.addEventListener("click", (e) => {
  if (e.target === cartModal) {
    cartModal.classList.remove("open");
    cartDialog.classList.remove("open");
  }
});
// ---------------------------------------------------------------------------------------------------------------------------------------------------

// PRODUCTS CATEGORIES
let categories = [
  "all",
  ...new Set(products.map((product) => product.category)),
];

categories.forEach((category) => {
  filterBtnList.innerHTML += `
              <button class="btn btn-warning-outlined btn-rounded capitalize" onclick="filterProducts('${category}')">${category}</button>
  `;
});

// FILTER PRODUCTS
function filterProducts(category) {
  productList.innerHTML = "";
  if (category === "all") {
    products.forEach((product) => {
      addProduct({ ...product });
    });
  }
  let newProducts = products.filter((product) => product.category === category);
  newProducts.forEach((product) => {
    addProduct({ ...product });
  });
}

// PRODUCTS
let sortedProducts = products.sort((a, b) =>
  Math.floor(Math.random() * a.id) > Math.floor(Math.random() * b.id) ? 1 : -1
);

sortedProducts.forEach((product) => {
  addProduct({ ...product });
});

function addProduct({ id, name, price, rating, img }) {
  let productHtml = `
            <div class="card shadow rounded bg-white height-350 p-2">
                <div class="img height-200  overflow-hidden">
                    <img src="${img}" alt="${name}" class="image object-cover h-100" id="image">
                </div>
                <div class="product-info text-center mt-1">
                    <h1 class="text-16 capitalize">${name}</h1>
                    <div class="ratings flex-justify-center gap-1 mt-1 warning-color">
                        ${calculateRating(rating)}
                    </div>
                    <h1 class="text-22 my-2 warning-color">$${price}</h1>
                    <button class="btn btn-warning btn-rounded mx-auto" onclick="addProductToCart(${id})">Add To Cart</button>
                </div>
            </div>
    `;
  productList.innerHTML += productHtml;
}

function calculateRating(rating) {
  if (rating > 1 && rating <= 1.9) {
    return `<i class='fa fa-star'></i><i class='far fa-star-half-alt'></i><span class="warning-bg-soft rounded-sm pl-1 pr-1">${rating}</span>`;
  } else if (rating > 1.9 && rating <= 2.9) {
    return `<i class='fa fa-star'></i><i class='fa fa-star'></i><i class='far fa-star-half-alt'></i><span class="warning-bg-soft rounded-sm pl-1 pr-1">${rating}</span>`;
  } else if (rating > 2.9 && rating <= 3.9) {
    return `<i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='far fa-star-half-alt'></i><span class="warning-bg-soft rounded-sm pl-1 pr-1">${rating}</span>`;
  } else if (rating > 3.9 && rating <= 4.9) {
    return `<i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='far fa-star-half-alt'></i><span class="warning-bg-soft rounded-sm pl-1 pr-1">${rating}</span>`;
  } else {
    return `<i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i><i class='fa fa-star'></i><span class="warning-bg-soft rounded-sm pl-1 pr-1">${rating}</span>`;
  }
}

// ----------------------------ADD TO CART FUNCTIONALITY-----------------

// Cart arrary to store Cart Items
let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
updateCart();

function addProductToCart(id) {
  let numberOfUnitsBought = 1;
  let cartItem = products.find((item) => item.id === id);
  cartItem = { ...cartItem, numberOfUnitsBought };
  if (cartItems.some((cartItem) => cartItem.id === id)) {
    updateNumberOfUnits("plus", id);
  } else {
    cartItems = [...cartItems, cartItem];
  }
  updateCart();
}

// Update the cart
function updateCart() {
  updateCartUI();
  noCartItems();
  updateSubTotal();
  // Save cart items to localStorage
  localStorage.setItem("cart", JSON.stringify(cartItems));
}

// Update Sub Total
function updateSubTotal() {
  let totalPrice = 0;
  cartItems.forEach((cartItem) => {
    totalPrice += cartItem.numberOfUnitsBought * cartItem.price;
  });
  qs(".subtotal").innerText = "$" + totalPrice.toFixed(2);
  qs(".count").innerText = cartItems.length;
}

noCartItems();
// Renders this if there are no cart items
function noCartItems() {
  if (cartItems.length === 0) {
    cartList.innerHTML = `
                <div class="no-cart-items flex- flex-col h-100">
                <img src="assets/images/market.png" alt="" class="image opacity-8">
                <h1 class="text-30 opacity-6 capitalize text-center">your cart is empty</h1>
            </div>
    `;
    qs(".clear-all").style.display = "none";
  } else {
    qs(".clear-all").style.display = "block";
  }
}

function updateCartUI() {
  cartList.innerHTML = "";
  cartItems
    .map((item) => {
      const { id, name, price, img, numberOfUnitsBought } = item;
      cartList.innerHTML += `
                 <div
                    class="cart-item flex-center-between shadow pr-5 rounded-sm overflow-hidden cursor-pointer relative">
                    <div class="grid grid-col-2 gap-1">
                        <img src="${img}" alt="${name}" class="object-cover">
                        <div>
                            <h1 class="text-muted text-14 capitalize">${name}</h1>
                            <h1 class="warning-color text-20 mt-1">$${price}</h1>
                        </div>
                    </div>
                    <div class="flex gap-1">
                        <button class="btn btn-circle btn-circle-sm bg-white shadow" onclick="updateNumberOfUnits('minus', ${id})"><i
                                class="feather-minus"></i></button>
                        <button class="btn btn-circle btn-circle-sm bg-white shadow">${numberOfUnitsBought}</button>
                        <button class="btn btn-circle btn-circle-sm bg-white shadow" onclick="updateNumberOfUnits('plus', ${id})"><i
                                class="feather-plus"></i></button>
                    </div>
                    <div class="remove-icon" hidden onclick="removeItem(${id})">
                        <i class="fa fa-times text-18 text-muted absolute top-none right-none cursor-pointer delete" ></i>
                    </div>
                </div>
    `;
    })
    .join("");
}

// Update the quantity of items in the cart for a particular item
function updateNumberOfUnits(action, id) {
  cartItems = cartItems.map((cartItem) => {
    let numberOfUnitsBought = cartItem.numberOfUnitsBought;
    if (cartItem.id === id) {
      if (action === "plus" && numberOfUnitsBought < cartItem.quantity) {
        numberOfUnitsBought++;
      } else if (action === "minus" && numberOfUnitsBought > 1) {
        numberOfUnitsBought--;
      }
    }
    return { ...cartItem, numberOfUnitsBought };
  });
  updateCart();
}

// Remove an Item from the cart list
function removeItem(id) {
  cartItems = cartItems.filter((item) => item.id !== id);
  updateCart();
}

// Clear cart
clearCart.addEventListener("click", () => {
  cartItems = [];
  updateCart();
});
