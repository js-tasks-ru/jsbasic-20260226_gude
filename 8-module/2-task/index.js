import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../../6-module/2-task/index.js';

export default class ProductGrid {
  constructor(products) {
    this.products = Array.isArray(products) ? products : [];
    this.filters = {};

    this._filterRules = {
      noNuts: (value, product) => !(value && product.nuts),
      vegeterianOnly: (value, product) => !(value && !product.vegeterian),
      maxSpiciness: (value, product) => value === undefined || product.spiciness <= value,
      category: (value, product) => !value || value === '' || product.category === value,
    };

    this.elem = createElement('<div class="products-grid"></div>');
    this.inner = createElement('<div class="products-grid__inner"></div>');
    this.elem.append(this.inner);
    this.render();
  }
  
  render() {
    this._clearInner();
    const filteredProducts = this._getFilteredProducts();
    this._renderProducts(filteredProducts);
  }

  _clearInner() {
    while (this.inner.firstChild) {
      this.inner.removeChild(this.inner.firstChild);
    }
  }

  _getFilteredProducts() {
    return this.products.filter(product => this.matchesFilters(product));
  }

  _renderProducts(products) {
    for (const product of products) {
      const card = new ProductCard(product);
      this.inner.append(card.elem);
    }
  }

  matchesFilters(product) {
    for (const [key, rule] of Object.entries(this._filterRules)) {
      if (!rule(this.filters[key], product)) return false;
    }
    return true;
  }

  updateFilter(filters) {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined)
    );
    Object.assign(this.filters, cleanedFilters);
    this.render();
  }
}
