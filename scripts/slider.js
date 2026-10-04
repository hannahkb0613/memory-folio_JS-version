'use strict';

const sliders = document.querySelectorAll("[data-slider]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const glideTo = function (container, target) {
  const maxScroll = container.scrollWidth - container.clientWidth;
  target = Math.max(0, Math.min(target, maxScroll));

  if (reduceMotion) {
    container.scrollLeft = target;
    return;
  }

  cancelAnimationFrame(container.glideId);

  const start = container.scrollLeft;
  const distance = target - start;
  const duration = 700;
  let startTime = null;

  const step = function (time) {
    if (startTime === null) startTime = time;
    const progress = Math.min((time - startTime) / duration, 1);

    const eased = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    container.scrollLeft = start + distance * eased;

    if (progress < 1) container.glideId = requestAnimationFrame(step);
  }

  container.glideId = requestAnimationFrame(step);
}

const sliderInit = function (currentSlider) {

  const sliderContainer = currentSlider.querySelector("[data-slider-container]");
  const sliderPrevBtn = currentSlider.querySelector("[data-slider-prev]");
  const sliderNextBtn = currentSlider.querySelector("[data-slider-next]");
  const items = sliderContainer.children;

  const updateButtons = function () {
    const maxScroll = sliderContainer.scrollWidth - sliderContainer.clientWidth;
    sliderPrevBtn.disabled = sliderContainer.scrollLeft <= 1;
    sliderNextBtn.disabled = sliderContainer.scrollLeft >= maxScroll - 1;
  }

  sliderNextBtn.addEventListener("click", function () {
    const rightEdge = sliderContainer.scrollLeft + sliderContainer.clientWidth;

    for (let i = 0; i < items.length; i++) {
      const itemRight = items[i].offsetLeft + items[i].offsetWidth;
      if (itemRight > rightEdge + 1) {
        glideTo(sliderContainer, items[i].offsetLeft);
        return;
      }
    }
  });

  sliderPrevBtn.addEventListener("click", function () {
    const leftEdge = sliderContainer.scrollLeft;

    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i].offsetLeft < leftEdge - 1) {
        const itemRight = items[i].offsetLeft + items[i].offsetWidth;
        let target = itemRight - sliderContainer.clientWidth;

        for (let j = 0; j < items.length; j++) {
          if (items[j].offsetLeft >= target) {
            target = items[j].offsetLeft;
            break;
          }
        }

        glideTo(sliderContainer, target);
        return;
      }
    }
  });

  sliderContainer.addEventListener("scroll", updateButtons);
  window.addEventListener("resize", updateButtons);

  sliderContainer.querySelectorAll("img").forEach(img => img.addEventListener("load", updateButtons));
  sliderContainer.querySelectorAll("video").forEach(video => video.addEventListener("loadedmetadata", updateButtons));

  currentSlider.updateButtons = updateButtons;
  updateButtons();
}

for (let i = 0, len = sliders.length; i < len; i++) {
  sliderInit(sliders[i]);
}