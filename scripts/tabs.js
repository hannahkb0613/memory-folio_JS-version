'use strict';

const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.classList.remove("active"));

    tabContents.forEach(c => c.classList.remove("active"));

    document.querySelectorAll("video").forEach(v => v.pause());

    tab.classList.add("active");
    const target = document.getElementById(tab.getAttribute("data-tab"));
    if (target) {
      target.classList.add("active");
      const slider = target.querySelector("[data-slider]");
      if (slider) {
        slider.querySelector("[data-slider-container]").scrollLeft = 0;
        slider.updateButtons();
      }
    }
  });
});