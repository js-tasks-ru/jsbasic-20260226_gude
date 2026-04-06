import createElement from '../../assets/lib/create-element.js';

export default class StepSlider {
  constructor({ steps, value = 0 }) {
    this.steps = steps;
    this._value = Math.max(0, Math.min(value, this.steps - 1));
    this._activeIndex = undefined;

    this._onSliderClick = this._onSliderClick.bind(this);
    this.elem = this._render();
    this._addEventListeners();
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

  _onSliderClick(event) {
    if (this.steps <= 1) return;

    const rect = this.elem.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const leftRelative = left / rect.width;
    const segments = this.steps - 1;
    let approximateValue = leftRelative * segments;
    let value = Math.round(approximateValue);
    value = Math.max(0, Math.min(value, this.steps - 1));
    if (value !== this._value) {
      this._setValue(value);
    }
  }

  _setValue(value, skipEvent = false) {
    this._value = value;

    this._refs.valueSpan.textContent = value;

    if (this._activeIndex !== undefined) {
      this._refs.stepSpans[this._activeIndex].classList.remove('slider__step-active');
    }
    this._refs.stepSpans[value].classList.add('slider__step-active');
    this._activeIndex = value;

    const leftPercents = this._valueToPercents(value);
    this._refs.thumb.style.left = `${leftPercents}%`;
    this._refs.progress.style.width = `${leftPercents}%`;

    if (!skipEvent) {
      const event = new CustomEvent('slider-change', {
        detail: value,
        bubbles: true
      });
      this.elem.dispatchEvent(event);
    }
  }

  _valueToPercents(value) {
    const segments = this.steps - 1;
    if (segments <= 0) return 0;
    return (value / segments) * 100;
  }
}
