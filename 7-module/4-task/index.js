import createElement from '../../assets/lib/create-element.js';

export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this._value = Math.max(0, Math.min(value, this.steps - 1));
    this._activeIndex = undefined;
    this._dragActive = false;
    this._suppressClick = false;

    this._onSliderClick = this._onSliderClick.bind(this);
    this._onPointerDown = this._onPointerDown.bind(this);
    this._onPointerMove = this._onPointerMove.bind(this);
    this._onPointerUp = this._onPointerUp.bind(this);

    this.elem = this._render();
    this._addEventListeners();
    this._initDragAndDrop();
    this._setValue(this._value, true);
  }

  _render() {
    const slider = createElement('<div>');
    slider.classList.add('slider');

    const thumb = this._createThumb();
    const progress = this._createProgress();
    const stepsContainer = this._createSteps();

    slider.append(thumb, progress, stepsContainer);

    this._refs = {
      thumb,
      progress,
      valueSpan: thumb.querySelector('.slider__value'),
      stepsContainer,
      stepSpans: Array.from(stepsContainer.children),
    };

    return slider;
  }

  _createThumb() {
    const thumb = createElement('<div>');
    thumb.classList.add('slider__thumb');
    const valueSpan = createElement('<span>');
    valueSpan.classList.add('slider__value');
    valueSpan.textContent = this._value;
    thumb.appendChild(valueSpan);
    return thumb;
  }

  _createProgress() {
    const progress = createElement('<div>');
    progress.classList.add('slider__progress');
    return progress;
  }

  _createSteps() {
    const stepsDiv = createElement('<div>');
    stepsDiv.classList.add('slider__steps');
    for (let i = 0; i < this.steps; i++) {
      const stepSpan = createElement('<span>');
      if (i === this._value) {
        stepSpan.classList.add('slider__step-active');
      }
      stepsDiv.appendChild(stepSpan);
    }
    return stepsDiv;
  }

  _addEventListeners() {
    this.elem.addEventListener('click', this._onSliderClick);
  }

  _initDragAndDrop() {
    const thumb = this._refs.thumb;
    thumb.ondragstart = () => false;
    thumb.addEventListener('pointerdown', this._onPointerDown);
  }

  _onSliderClick(event) {
    if (this._suppressClick) {
      this._suppressClick = false;
      return;
    }
    if (this.steps <= 1) return;

    const value = this._positionToValue(event.clientX);
    if (value !== this._value) {
      this._setValue(value);
    }
  }

  _onPointerDown(event) {
    event.preventDefault();
    if (this.steps <= 1) return;

    this._dragActive = true;
    this.elem.classList.add('slider_dragging');

    document.addEventListener('pointermove', this._onPointerMove);
    document.addEventListener('pointerup', this._onPointerUp);
  }

  _onPointerMove(event) {
    event.preventDefault();
    if (!this._dragActive) return;

    const rect = this.elem.getBoundingClientRect();
    let left = event.clientX - rect.left;
    let leftRelative = this._clampRelative(left / rect.width);

    this._updateThumbProgress(leftRelative * 100);

    const value = this._relativeToValue(leftRelative);
    this._updateActiveStep(value);
    this._suppressClick = true;
  }

  _onPointerUp(event) {
    if (!this._dragActive) return;

    this._dragActive = false;
    this.elem.classList.remove('slider_dragging');

    document.removeEventListener('pointermove', this._onPointerMove);
    document.removeEventListener('pointerup', this._onPointerUp);

    const value = this._positionToValue(event.clientX);
    this._setValue(value, false);
    this._suppressClick = false;
  }

  _updateActiveStep(value) {
    this._refs.valueSpan.textContent = value;

    if (this._activeIndex !== undefined) {
      this._refs.stepSpans[this._activeIndex].classList.remove('slider__step-active');
    }
    this._refs.stepSpans[value].classList.add('slider__step-active');
    this._activeIndex = value;
  }

  _setValue(value, skipEvent = false) {
    this._value = value;

    const leftPercents = this._valueToPercents(value);
    this._updateThumbProgress(leftPercents);
    this._updateActiveStep(value);

    if (!skipEvent) {
      const event = new CustomEvent('slider-change', {
        detail: value,
        bubbles: true
      });
      this.elem.dispatchEvent(event);
    }
  }

  _positionToValue(clientX) {
    const rect = this.elem.getBoundingClientRect();
    const left = clientX - rect.left;
    const leftRelative = this._clampRelative(left / rect.width);
    return this._relativeToValue(leftRelative);
  }

  _clampRelative(leftRelative) {
    return Math.min(1, Math.max(0, leftRelative));
  }

  _relativeToValue(leftRelative) {
    const segments = this.steps - 1;
    let approximateValue = leftRelative * segments;
    let value = Math.round(approximateValue);
    return Math.min(this.steps - 1, Math.max(0, value));
  }

  _updateThumbProgress(percents) {
    this._refs.thumb.style.left = `${percents}%`;
    this._refs.progress.style.width = `${percents}%`;
  }

  get value() {
    return this._value;
  }

  _valueToPercents(value) {
    const segments = this.steps - 1;
    if (segments <= 0) return 0;
    return (value / segments) * 100;
  }
}
