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

  getBagButtons(){
    const buttons = [...document.querySelectorAll('.bag-btn')]; //format from nodelist to array
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
          //! add product to the cart
          //! save cart in local storage
          //! set cart values
          //! display cart item
          //! show the cart
      });

    });
  }

}

//local storage
class Storage {
  static saveProducts(products){
    localStorage.setItem("products", JSON.stringify(products));
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  //get all products
  products.getProducts().then(products => {
    ui.displayProducts(products);
    Storage.saveProducts(products);
  }).then(() => {
    ui.getBagButtons();
  }); 


});






