import createElement from '../../assets/lib/create-element.js';

export default class Carousel {
  constructor(slides) {
    this.slides = slides;
    this._currentIndex = 0;

    this._onRightArrowClick = this._onRightArrowClick.bind(this);
    this._onLeftArrowClick = this._onLeftArrowClick.bind(this);
    this._onRootClick = this._onRootClick.bind(this);

    this.elem = this._render();
    this._initEventListeners();
    this._update();
  }

  _render() {
    const { root, inner } = this._renderRoot();

    this._renderSlides(inner);
    this._renderArrows(root);
    root.append(inner);

    return root;
  }

  _renderRoot() {
    const root = createElement(`<div class="carousel"></div>`);
    const inner = createElement(`<div class="carousel__inner"></div>`);

    this._refs = {
      inner,
      leftArrow: null,
      rightArrow: null,
    };
    this._slides = [];

    return { root, inner };
  }

  _renderSlides(inner) {
    const slidesElements = [];

    for (const slide of this.slides) {
      const slideEl = this._createSlide(slide);
      slidesElements.push(slideEl);
      inner.append(slideEl);
    }

    this._slides = slidesElements;
  }

  _renderArrows(root) {
    const leftArrow = createElement(`
      <div class="carousel__arrow carousel__arrow_left">
        <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
      </div>
    `);
    const rightArrow = createElement(`
      <div class="carousel__arrow carousel__arrow_right">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </div>
    `);

    this._refs.leftArrow = leftArrow;
    this._refs.rightArrow = rightArrow;

    root.append(leftArrow, rightArrow);
  }

  _createSlide(slide) {
    const slideEl = createElement(`<div class="carousel__slide"></div>`);
    slideEl.dataset.id = slide.id;

    const img = createElement(`<img class="carousel__img" alt="slide">`);
    img.src = `/assets/images/carousel/${slide.image}`;

    const caption = createElement(`<div class="carousel__caption"></div>`);
    const priceSpan = createElement(`<span class="carousel__price"></span>`);
    priceSpan.textContent = `€${slide.price.toFixed(2)}`;
    const titleDiv = createElement(`<div class="carousel__title"></div>`);
    titleDiv.textContent = slide.name;
    const button = createElement(`
      <button type="button" class="carousel__button">
        <img src="/assets/images/icons/plus-icon.svg" alt="icon">
      </button>
    `);

    caption.append(priceSpan, titleDiv, button);
    slideEl.append(img, caption);

    return slideEl;
  }

  _initEventListeners() {
    this._refs.rightArrow.addEventListener('click', this._onRightArrowClick);
    this._refs.leftArrow.addEventListener('click', this._onLeftArrowClick);
    this.elem.addEventListener('click', this._onRootClick);
  }

  _onRightArrowClick() {
    this._next();
  }

  _onLeftArrowClick() {
    this._prev();
  }

  _onRootClick(event) {
    const button = event.target.closest('.carousel__button');
    if (!button) return;

    const slide = button.closest('.carousel__slide');
    if (!slide) return;

    this._emitProductAdd(slide.dataset.id);
  }

  _emitProductAdd(slideId) {
    const productAddEvent = new CustomEvent('product-add', {
      detail: slideId,
      bubbles: true
    });
    this.elem.dispatchEvent(productAddEvent);
  }

  _next() {
    this._setIndex(this._currentIndex + 1);
  }

  _prev() {
    this._setIndex(this._currentIndex - 1);
  }

  _setIndex(nextIndex) {
    const lastIndex = this._slides.length - 1;
    const clampedIndex = Math.max(0, Math.min(nextIndex, lastIndex));
    if (clampedIndex === this._currentIndex) return;

    this._currentIndex = clampedIndex;
    this._update();
  }

  _update() {
    this._updatePosition();
    this._updateArrows();
  }

  _updatePosition() {
    const slideWidth = this._slides[0].offsetWidth;
    const offset = -this._currentIndex * slideWidth;
    this._refs.inner.style.transform = `translateX(${offset}px)`;
  }

  _updateArrows() {
    this._refs.leftArrow.style.display = this._currentIndex === 0 ? 'none' : '';
    this._refs.rightArrow.style.display = this._currentIndex === this._slides.length - 1 ? 'none' : '';
  }
}
