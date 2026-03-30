import createElement from '../../assets/lib/create-element.js';

export default class ProductCard {
  constructor(product) {
    this.product = product;
    this.elem = this.render();
  }

  render() {
    const { name, price, image } = this.product;

    const priceFormatted = Number(price).toFixed(2);
    const imagePath = `/assets/images/products/${image}`;

    const card = createElement(`
      <div class="card">
        <div class="card__top">
          <img src="${imagePath}" class="card__image" alt="product">
          <span class="card__price">€${priceFormatted}</span>
        </div>
        <div class="card__body">
          <div class="card__title">${name}</div>
          <button type="button" class="card__button">
            <img src="/assets/images/icons/plus-icon.svg" alt="icon">
          </button>
        </div>
      </div>
      `);

    const button = card.querySelector('.card__button');
    button.addEventListener('click', () => {
      card.dispatchEvent(new CustomEvent('product-add', { detail: this.product.id, bubbles: true }));
    });

    return card;
  }
}
