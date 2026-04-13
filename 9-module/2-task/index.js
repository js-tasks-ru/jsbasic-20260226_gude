import Carousel from '../../6-module/3-task/index.js';
import slides from '../../6-module/3-task/slides.js';

import RibbonMenu from '../../7-module/1-task/index.js';
import categories from '../../7-module/1-task/categories.js';

import StepSlider from '../../7-module/4-task/index.js';
import ProductsGrid from '../../8-module/2-task/index.js';

import CartIcon from '../../8-module/1-task/index.js';
import Cart from '../../8-module/4-task/index.js';

export default class Main {

  constructor() {
    this.carousel = null;
    this.ribbonMenu = null;
    this.stepSlider = null;
    this.cartIcon = null;
    this.cart = null;
    this.products = [];
    this.productsGrid = null;

    this._onProductAdd = this._onProductAdd.bind(this);
    this._onSliderChange = this._onSliderChange.bind(this);
    this._onRibbonSelect = this._onRibbonSelect.bind(this);
    this._onNutsChange = this._onNutsChange.bind(this);
    this._onVegetarianChange = this._onVegetarianChange.bind(this);
  }

  async render() {
    this._initElements();
    this._initCarousel();
    this._initRibbonMenu();
    this._initStepSlider();
    this._initCart();
    await this._loadProducts();
    this._initProductsGrid();
    this._updateInitialFilters();
    this._addEventListeners();
  }

  _initElements() {
    this.elements = {
      carouselHolder: document.querySelector('[data-carousel-holder]'),
      ribbonHolder: document.querySelector('[data-ribbon-holder]'),
      sliderHolder: document.querySelector('[data-slider-holder]'),
      cartIconHolder: document.querySelector('[data-cart-icon-holder]'),
      gridHolder: document.querySelector('[data-products-grid-holder]'),
      nutsCheckbox: document.getElementById('nuts-checkbox'),
      vegetarianCheckbox: document.getElementById('vegeterian-checkbox')
    };
  }

  _initCarousel() {
    if (!this.elements.carouselHolder) return;
    this.carousel = new Carousel(slides);
    this.elements.carouselHolder.append(this.carousel.elem);
  }

  _initRibbonMenu() {
    if (!this.elements.ribbonHolder) return;
    this.ribbonMenu = new RibbonMenu(categories);
    this.elements.ribbonHolder.append(this.ribbonMenu.elem);
  }

  _initStepSlider() {
    if (!this.elements.sliderHolder) return;
    this.stepSlider = new StepSlider({ steps: 5, value: 3 });
    this.elements.sliderHolder.append(this.stepSlider.elem);
  }

  _initCart() {
    if (!this.elements.cartIconHolder) return;
    this.cartIcon = new CartIcon();
    this.elements.cartIconHolder.append(this.cartIcon.elem);
    this.cart = new Cart(this.cartIcon);
  }

  async _loadProducts() {
    try {
      const response = await fetch('products.json');
      if (!response.ok) throw new Error('Failed to load products');
      this.products = await response.json();
    } catch (error) {
      console.error('Failed to load products:', error);
      this.products = [];
    }
  }

  _initProductsGrid() {
    if (!this.elements.gridHolder) return;
    this.productsGrid = new ProductsGrid(this.products);
    this._clearGridHolder();
    this.elements.gridHolder.append(this.productsGrid.elem);
  }

  _clearGridHolder() {
    while (this.elements.gridHolder.firstChild) {
      this.elements.gridHolder.removeChild(this.elements.gridHolder.firstChild);
    }
  }

  _updateInitialFilters() {
    if (!this.productsGrid) return;
    const activeCategory = this.ribbonMenu?.elem.querySelector('.ribbon__item_active')?.dataset.id || '';
    
    this.productsGrid.updateFilter({
      noNuts: this.elements.nutsCheckbox?.checked || false,
      vegeterianOnly: this.elements.vegetarianCheckbox?.checked || false,
      maxSpiciness: this.stepSlider?.value || 0,
      category: activeCategory
    });
  }

  _addEventListeners() {
    document.body.addEventListener('product-add', this._onProductAdd);
    document.body.addEventListener('slider-change', this._onSliderChange);
    document.body.addEventListener('ribbon-select', this._onRibbonSelect);
    
    if (this.elements.nutsCheckbox) {
      this.elements.nutsCheckbox.addEventListener('change', this._onNutsChange);
    }
    if (this.elements.vegetarianCheckbox) {
      this.elements.vegetarianCheckbox.addEventListener('change', this._onVegetarianChange);
    }
  }

  _onProductAdd(event) {
    const productId = event.detail;
    const product = this.products.find(p => p.id === productId);
    if (product) {
      this.cart.addProduct(product);
    }
  }

  _onSliderChange(event) {
    if (this.productsGrid) {
      this.productsGrid.updateFilter({ maxSpiciness: event.detail });
    }
  }

  _onRibbonSelect(event) {
    if (this.productsGrid) {
      this.productsGrid.updateFilter({ category: event.detail });
    }
  }

  _onNutsChange(event) {
    if (this.productsGrid) {
      this.productsGrid.updateFilter({ noNuts: event.target.checked });
    }
  }

  _onVegetarianChange(event) {
    if (this.productsGrid) {
      this.productsGrid.updateFilter({ vegeterianOnly: event.target.checked });
    }
  }
}
