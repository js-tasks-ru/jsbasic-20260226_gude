function initCarousel() {
  const carousel = document.querySelector(".carousel");
  if (!carousel) {
    console.warn("Carousel container not found");
    return;
  }

  const carouselInner = carousel.querySelector(".carousel__inner");
  if (!carouselInner) {
    console.warn("Carousel inner element not found");
    return;
  }

  const slides = carousel.querySelectorAll(".carousel__slide");
  if (slides.length === 0) {
    console.warn("No slides found");
    return;
  }

  const arrowLeft = carousel.querySelector(".carousel__arrow_left");
  const arrowRight = carousel.querySelector(".carousel__arrow_right");
  if (!arrowLeft || !arrowRight) {
    console.warn("Arrow buttons not found");
    return;
  }

  let indexSlide = 0;

  function render() {
    updateCarousel();
    updateArrows();
  }

  function updateCarousel() {
    const slideWidth = slides[0].offsetWidth;
    const offset = -indexSlide * slideWidth;
    carouselInner.style.transform = `translateX(${offset}px)`;
  }

  arrowRight.onclick = () => {
    if (indexSlide < slides.length - 1) indexSlide++;
    render();
  };

  arrowLeft.onclick = () => {
    if (indexSlide > 0) indexSlide--;
    render();
  };

  function updateArrows() {
    arrowLeft.style.display = indexSlide === 0 ? "none" : "";
    arrowRight.style.display = indexSlide === slides.length - 1 ? "none" : "";
  }

  render();
}
