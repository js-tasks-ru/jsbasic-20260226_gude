import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  constructor(categories) {
    this.categories = categories;
    this.SCROLL_STEP = 350;
    this.SCROLL_EPS = 1;

    this._onArrowLeftClick = this._onArrowLeftClick.bind(this);
    this._onArrowRightClick = this._onArrowRightClick.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._onInnerClick = this._onInnerClick.bind(this);

    this.elem = this.render();
  }

  render() {
    const ribbon = createElement('<div>');
    ribbon.classList.add('ribbon');

    const arrowLeft = this._createArrow('left');
    const arrowRight = this._createArrow('right');
    ribbon.append(arrowLeft, arrowRight);

    const inner = createElement('<nav>');
    inner.classList.add('ribbon__inner');
    ribbon.appendChild(inner);

    for (const category of this.categories) {
      const link = document.createElement('a');
      link.classList.add('ribbon__item');
      link.href = '#';
      link.dataset.id = category.id;
      link.textContent = category.name;
      inner.appendChild(link);
    }

    const firstLink = inner.querySelector('.ribbon__item');
    if (firstLink) firstLink.classList.add('ribbon__item_active');

    this._refs = { inner, arrowLeft, arrowRight };

    const resizeObserver = new ResizeObserver(this._onScroll);
    resizeObserver.observe(inner);

    arrowLeft.addEventListener('click', this._onArrowLeftClick);
    arrowRight.addEventListener('click', this._onArrowRightClick);
    inner.addEventListener('scroll', this._onScroll);
    inner.addEventListener('click', this._onInnerClick);

    return ribbon;
  }

  _createArrow(side) {
    const button = createElement('<button>');
    button.classList.add('ribbon__arrow', `ribbon__arrow_${side}`);
    const img = createElement('<img>');
    img.src = '/assets/images/icons/angle-icon.svg';
    img.alt = 'icon';
    button.appendChild(img);
    return button;
  }

  _onArrowLeftClick() {
    this._refs.inner.scrollBy(-this.SCROLL_STEP, 0);
  }

  _onArrowRightClick() {
    this._refs.inner.scrollBy(this.SCROLL_STEP, 0);
  }

  _onScroll() {
    const { inner, arrowLeft, arrowRight } = this._refs;
    const scrollLeft = inner.scrollLeft;
    const scrollWidth = inner.scrollWidth;
    const clientWidth = inner.clientWidth;
    const scrollRight = scrollWidth - scrollLeft - clientWidth;

    arrowLeft.classList.toggle('ribbon__arrow_visible', scrollLeft > 0);
    arrowRight.classList.toggle('ribbon__arrow_visible', scrollRight > this.SCROLL_EPS);
  }

  _onInnerClick(event) {
    const link = event.target.closest('.ribbon__item');
    if (!link) return;
    event.preventDefault();

    const { inner } = this._refs;
    const currentActive = inner.querySelector('.ribbon__item_active');
    if (currentActive) currentActive.classList.remove('ribbon__item_active');
    link.classList.add('ribbon__item_active');

    const customEvent = new CustomEvent('ribbon-select', {
      detail: link.dataset.id,
      bubbles: true
    });
    this.elem.dispatchEvent(customEvent);
  }
}
