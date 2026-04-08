import createElement from '../../assets/lib/create-element.js';

export default class CartIcon {
  constructor() {
    this.MOBILE_BREAKPOINT = 767;
    this.FIXED_TOP = 50;
    this.FIXED_Z_INDEX = 1000;
    this.CONTAINER_OFFSET = 20;
    this.WINDOW_MARGIN = 10;

    this._onScroll = this._onScroll.bind(this);
    this._onResize = this._onResize.bind(this);

    this.render();
    this.addEventListeners();
  }

  render() {
    this.elem = createElement('<div class="cart-icon"></div>');
  }

  update(cart) {
    if (!cart.isEmpty()) {
      this.elem.classList.add('cart-icon_visible');

      this._renderInner(cart);
      this.updatePosition();

      this.elem.classList.add('shake');
      this.elem.addEventListener('transitionend', () => {
        this.elem.classList.remove('shake');
      }, { once: true });

    } else {
      this.elem.classList.remove('cart-icon_visible');
      this._resetStyles();
    }
  }

  _renderInner(cart) {
    const inner = createElement('<div class="cart-icon__inner"></div>');
    const countSpan = createElement('<span class="cart-icon__count"></span>');
    const priceSpan = createElement('<span class="cart-icon__price"></span>');

    countSpan.textContent = cart.getTotalCount();
    priceSpan.textContent = `€${cart.getTotalPrice().toFixed(2)}`;

    inner.append(countSpan, priceSpan);
    this.elem.innerHTML = '';
    this.elem.append(inner);
  }

  addEventListeners() {
    document.addEventListener('scroll', this._onScroll);
    window.addEventListener('resize', this._onResize);
  }

  _onScroll() {
    this.updatePosition();
  }

  _onResize() {
    this.updatePosition();
  }

  updatePosition() {
    if (!this.elem.classList.contains('cart-icon_visible') || this.elem.offsetHeight === 0) {
      return;
    }

    const isMobile = document.documentElement.clientWidth <= this.MOBILE_BREAKPOINT;
    if (isMobile) {
      this._updateMobilePosition();
      return;
    }

    this._updateDesktopPosition();
  }

  _updateMobilePosition() {
    this._resetStyles();
  }

  _updateDesktopPosition() {
    if (this.elem.style.position !== 'fixed') {
      this.initialTopCoord = this.elem.getBoundingClientRect().top + window.pageYOffset;
    }

    const isScrollBeyond = window.pageYOffset > this.initialTopCoord;

    if (isScrollBeyond) {
      const container = document.querySelector('.container');
      if (!container) {
        this._resetStyles();
        return;
      }

      const containerRight = container.getBoundingClientRect().right;
      const windowWidth = document.documentElement.clientWidth;
      const elemWidth = this.elem.offsetWidth;

      const leftIndent = Math.min(
        containerRight + this.CONTAINER_OFFSET,
        windowWidth - elemWidth - this.WINDOW_MARGIN
      );

      Object.assign(this.elem.style, {
        position: 'fixed',
        top: `${this.FIXED_TOP}px`,
        zIndex: this.FIXED_Z_INDEX,
        left: `${leftIndent}px`,
        right: ''
      });
    } else {
      this._resetStyles();
    }
  }

  _resetStyles() {
    Object.assign(this.elem.style, {
      position: '',
      top: '',
      left: '',
      zIndex: '',
      right: ''
    });
  }
}
