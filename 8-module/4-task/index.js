import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
  }

  addProduct(product) {
    if (!product || !product.id) return;
    let cartItem = this.cartItems.find(item => item.product.id === product.id);

    if (cartItem) {
      cartItem.count += 1;
    } else {
      cartItem = { product, count: 1 };
      this.cartItems.push(cartItem);
    }
    this.onProductUpdate(cartItem);
  }

  updateProductCount(productId, amount) {
    if (!productId || typeof productId !== 'string') return;
    if (typeof amount !== 'number' || !Number.isFinite(amount)) return;
    const index = this.cartItems.findIndex(item => item.product.id === productId);
    if (index === -1) return;

    const cartItem = this.cartItems[index];

    cartItem.count += amount;

    if (cartItem.count === 0) {
      this.cartItems.splice(index, 1);
    }

    this.onProductUpdate(cartItem);
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    return this.cartItems.reduce((total, item) => total + item.count, 0);
  }

  getTotalPrice() {
    return this.cartItems.reduce((total, item) => total + item.product.price * item.count, 0);
  }

  renderProduct(product, count) {
    const image = product.image || 'placeholder.png';
    return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="/assets/images/products/${image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(2)}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    if (this.modal) {
      this.modal.close();
      this.modal = null;
    }
    this.modal = new Modal();
    this.modal.setTitle('Your order');

    const container = document.createElement('div');

    for (let item of this.cartItems) {
      container.append(this.renderProduct(item.product, item.count));
    }

    const orderForm = this.renderOrderForm();
    container.append(orderForm);

    this.modal.setBody(container);
    this.modal.open();

    container.addEventListener('click', (event) => {
      const plusBtn = event.target.closest('.cart-counter__button_plus');
      const minusBtn = event.target.closest('.cart-counter__button_minus');
      if (plusBtn) {
        const productElem = plusBtn.closest('.cart-product');
        const productId = productElem.dataset.productId;
        this.updateProductCount(productId, 1);
      } else if (minusBtn) {
        const productElem = minusBtn.closest('.cart-product');
        const productId = productElem.dataset.productId;
        this.updateProductCount(productId, -1);
      }
    });

    orderForm.addEventListener('submit', (event) => this.onSubmit(event));
  }

  onProductUpdate(cartItem) {

    this.cartIcon.update(this);

    if (!document.body.classList.contains('is-modal-open')) {
      return;
    }

    const modalElem = document.querySelector('.modal');
    if (!modalElem) {
      return;
    }

    const productId = cartItem.product.id;
    const productElem = modalElem.querySelector(`[data-product-id="${productId}"]`);

    if (cartItem.count === 0) {
      if (productElem) productElem.remove();
    } else if (productElem) {
      const countSpan = productElem.querySelector('.cart-counter__count');
      const priceSpan = productElem.querySelector('.cart-product__price');
      if (countSpan) countSpan.textContent = cartItem.count;
      if (priceSpan) priceSpan.textContent = `€${(cartItem.product.price * cartItem.count).toFixed(2)}`;
    }

    const totalPriceElem = modalElem.querySelector('.cart-buttons__info-price');
    if (totalPriceElem) {
      totalPriceElem.textContent = `€${this.getTotalPrice().toFixed(2)}`;
    }

    if (this.isEmpty()) {
      if (this.modal) {
        this.modal.close();
        this.modal = null;
      }
    }
  }

  async onSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.classList.add('is-loading');

    const formData = new FormData(form);

    try {
      const response = await fetch('https://httpbin.org/post', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        this.modal.setTitle('Success!');
        this.cartItems = [];
        this.cartIcon.update(this);

        const successHtml = `
          <div class="modal__body-inner">
            <p>
              Order successful! Your order is being cooked :) <br>
              We'll notify you about delivery time shortly.<br>
              <img src="/assets/images/delivery.gif">
            </p>
          </div>
        `;
        this.modal.setBody(createElement(successHtml));
      } else {
        this.modal.setTitle('Error!');
        this.modal.setBody(createElement(`
          <div class="modal__body-inner">
            <p>Failed to submit order. Please try again later.</p>
          </div>
        `));
      }
    } catch (error) {
      console.error('Submit error:', error);
      this.modal.setTitle('Error!');
      this.modal.setBody(createElement(`
        <div class="modal__body-inner">
          <p>Network error. Please check your connection and try again.</p>
        </div>
      `));
    } finally {
      submitButton.classList.remove('is-loading');
    }
  }

  addEventListeners() {
    if (this.cartIcon?.elem) {
      this.cartIcon.elem.onclick = () => this.renderModal();
    }
  }
}
