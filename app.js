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
let buttonsDOM = [];

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

  getBagButtons(){
    const buttons = [...document.querySelectorAll('.bag-btn')];
    buttonsDOM = buttons; //format from nodelist to array
    buttons.forEach(button =>{
       let id = button.dataset.id;
       let inCart = cart.find(item => item.id === id);

       if(inCart){
          button.innerText = "in Cart";
          button.disabled = true;
       }
       
      button.addEventListener('click', (e) =>{
          e.target.innerText = "in Cart";
          e.target.disabled = true;
          //! get product from products
          let cartItem = {...Storage.getProduct(id), amount:1};
          //! add product to the cart
          cart = [...cart, cartItem];
          //! save cart in local storage
          Storage.saveCart(cart); 
          //! set cart values
          this.setCartValues(cart);
          //! display cart item
          this.addCartItem(cartItem);
          //! show the cart
          this.showCart();
      });

    });
  }

  setCartValues(cart){
    let tempTotal = 0;
    let itemsTotal = 0;

    cart.map(item =>{
       tempTotal += item.price * item.amount;
       itemsTotal += item.amount;
    });
    cartItems.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }

  addCartItem(item){
     const div = document.createElement('div');
     div.classList.add('cart-item');
     div.innerHTML = `
     <img src=${item.image} alt="">
     <div>
         <h4>${item.title}</h4>
         <h5>$${item.price}</h5>
         <span class="remove-item" data-id=${item.id}>remove</span>
     </div>
     <div>
         <i class="fas fa-chevron-up" data-id=${item.id}></i>
         <p class="item-amount">${item.amount}</p>
         <i class="fas fa-chevron-down" data-id=${item.id}></i>
     </div>
     `;
     cartContent.appendChild(div);
  }

  showCart(){
    cartOverlay.classList.add('transparentBcg');
    cartDOM.classList.add('showCart');
  }

  setupAPP(){
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener('click', this.showCart);
    closeCartBtn.addEventListener('click', this.hideCart);
  }

  populateCart(cart){
    cart.forEach(item =>{
      this.addCartItem(item);
    });
  }

  hideCart(){
    cartOverlay.classList.remove('transparentBcg');
    cartDOM.classList.remove('showCart');
  }
}

//local storage
class Storage {
  static saveProducts(products){
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id){
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find(product => product.id === id );
  }

  static saveCart(cart){
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  static getCart(){
    return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
  //setup app
  ui.setupAPP();
  //get all products
  products.getProducts().then(products => {
    ui.displayProducts(products);
    Storage.saveProducts(products);
  }).then(() => {
    ui.getBagButtons();
  }); 


});




