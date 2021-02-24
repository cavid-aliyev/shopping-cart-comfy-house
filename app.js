//variables

const cartBtn = document.querySelector(".cart-btn"),
  closeCartBtn = document.querySelector(".close-cart"),
  clearCartBtn = document.querySelector(".clear-cart"),
  cartDOM = document.querySelector(".cart"),
  cartOverlay = document.querySelector(".cart-overlay"),
  cartItems = document.querySelector(".cart-items"),
  cartTotal = document.querySelector(".cart-total"),
  cartContent = document.querySelector(".cart-content"),
  productsDOM = document.querySelector(".products-center");

// cart
let cart = [];

// getting the products
class Products {
  async getProducts() {
    try {
      let result = await fetch("products.json");
      let data = await result.json(); //get data in json format
      let products = data.items;
      //destructure json items
      products = products.map((item) => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

//display products
class UI {
  displayProducts(products) {
    let result = '';
    products.forEach(product => {
        result += `
        <!--? Single product start -->
        <article class="product">
          <div class="img-container">
            <img src=${product.image} alt="" />
            <button class="bag-btn" data-id="${product.id}">
              <i class="fas fa-shopping-cart"></i>
              add to bag
            </button>
          </div>
          <h3>${product.title}</h3>
          <h4>$${product.price}</h4>
        </article>
        <!--? Single product end -->
        `;
    });
    productsDOM.innerHTML = result;
  }
}

//local storage
class Storage {}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  //get all products
  products.getProducts().then((products) => ui.displayProducts(products));
});
