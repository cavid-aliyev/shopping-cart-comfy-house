// Variables
const cartBtn = document.querySelector(".cart-btn"),
  closeCartBtn = document.querySelector(".close-cart"),
  clearCartBtn = document.querySelector(".clear-cart"),
  cartDOM = document.querySelector(".cart"),
  cartOverlay = document.querySelector(".cart-overlay"),
  cartItems = document.querySelector(".cart-items"),
  cartTotal = document.querySelector(".cart-total"),
  cartContent = document.querySelector(".cart-content"),
  productsDOM = document.querySelector(".products-center");

//cart
let cart = [];

//buttons
let butttonsDom = [];

// getting the products
class Products {
  async getProducts() {
    let result = fetch("products.json")
      .then(res => res.json())
      .then(data => {
        let products = data.items.map(item => {
          const { title, price } = item.fields;
          const { id } = item.sys;
          const imageUrl = item.fields.image.fields.file.url;

          return { title, price, id, imageUrl };
        });

        return products;
      })
      .catch(err => console.error(err));

    return result;
  }
}

// display products
class UI {
  displayProducts(products) {
    let result = products
      .map((product) => {
        return `<article class="product">
                        <div class="img-container">
                            <img src="${product.imageUrl}" alt="product" class="product-img">
                            <button class="bag-btn" data-id="${product.id}">
                                <i class="fas fa-shopping-cart"></i>
                                    add to bag
                            </button>
                        </div>
                        <h3>${product.title}</h3>
                        <h4>$ ${product.price}</h4>
                    </article>`;
      })
      .join("");

    productsDOM.innerHTML = result;
  }

  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    butttonsDom = buttons;


    buttons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id === id);

      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }

      button.addEventListener("click", (event) => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        let cartItem = { ...Storage.getProduct(id), amount: 1 };

        cart = [...cart, cartItem];

        Storage.saveCart(cart);

        this.setCartValues(cart);

        this.addCartItem(cartItem);

        this.showCart();
      });
    });
  }

  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;

    cart.forEach((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });

    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }

  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
            <img src="${item.imageUrl}" alt="product">
                <div>
                    <h4>${item.title}</h4>
                    <h5>$ ${item.price}</h5>
                    <span class="remove-item" data-id=${item.id}>remove</span>
                </div>
                <div>
                    <i class="fas fa-chevron-up" data-id=${item.id}></i>
                    <p class="item-amount">${item.amount}</p>
                    <i class="fas fa-chevron-down" data-id=${item.id}></i>
                </div>`;

    cartContent.append(div);
  }

  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }

  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
  }

  populateCart(cart) {
    cart.forEach((item) => {
      this.addCartItem(item);
    });
  }

  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }

  cartLogic() {
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        this.removeItem(removeItem.dataset.id);
        removeItem.closest(".cart-item").remove();
      } else if (event.target.classList.contains("fa-chevron-up")) {
        let id = event.target.dataset.id;
        this.increaseAmount(id);
        event.target.nextElementSibling.innerText =
          parseInt(event.target.nextElementSibling.innerText) + 1;
      } else if (event.target.classList.contains("fa-chevron-down")) {
        let id = event.target.dataset.id;
        this.decreaseAmount(id);

        if (parseInt(event.target.previousElementSibling.innerText) > 1) {
          event.target.previousElementSibling.innerText =
            parseInt(event.target.previousElementSibling.innerText) - 1;
        }
      }
    });
  }

  increaseAmount(id) {
    cart = cart.map((item) => {
      if (item.id === id) {
        item.amount++;
      }
      return item;
    });

    Storage.saveCart(cart);
    this.setCartValues(cart);
  }

  decreaseAmount(id) {
    cart = cart.map((item) => {
      if (item.amount > 1 && item.id === id) {
        item.amount--;
      }

      return item;
    });

    Storage.saveCart(cart);
    this.setCartValues(cart);
  }

  clearCart() {
    cart = [];
    this.setCartValues(cart);
    localStorage.removeItem("cart");
    cartContent.innerHTML = "";
    butttonsDom.forEach((btn) => {
      btn.innerText = "Add to Bag";
      btn.disabled = false;
    });
  }

  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart"></i> add to bag`;
  }

  getSingleButton(id) {
    return butttonsDom.find((btn) => btn.dataset.id === id);
  }
}

// local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {

  const ui = new UI();
  const products = new Products();

  ui.setupAPP();

  // get all products
  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
      ui.cartLogic();
    });
});
