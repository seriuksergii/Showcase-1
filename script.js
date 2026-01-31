(function () {
  const dateEl = document.getElementById("header-date");
  if (!dateEl) return;

  function formatDate(d) {
    return d.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function updateDate() {
    const now = new Date();
    dateEl.textContent = formatDate(now);
    dateEl.setAttribute("datetime", now.toISOString().slice(0, 10));
  }

  updateDate();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const msUntilMidnight = tomorrow.getTime() - Date.now();
  setTimeout(function setMidnightInterval() {
    updateDate();
    setInterval(updateDate, 24 * 60 * 60 * 1000);
  }, msUntilMidnight);
})();

(function () {
  const track = document.getElementById("hero-track");
  const trackWrap = track ? track.parentElement : null;
  const dotsContainer = document.getElementById("hero-dots");
  const prevBtn = document.querySelector(".hero__btn--prev");
  const nextBtn = document.querySelector(".hero__btn--next");
  if (!track || !dotsContainer) return;

  const totalSlides = 3;
  let currentSlide = 0;

  function getSlideWidth() {
    return trackWrap ? trackWrap.offsetWidth : 0;
  }

  function updateSlider() {
    const step = getSlideWidth();
    track.style.transform = "translateX(-" + currentSlide * step + "px)";
    dotsContainer.querySelectorAll(".hero__dot").forEach(function (dot, i) {
      dot.classList.toggle("hero__dot--active", i === currentSlide);
      dot.setAttribute("aria-selected", i === currentSlide);
    });
  }

  function goTo(slide) {
    currentSlide = ((slide % totalSlides) + totalSlides) % totalSlides;
    updateSlider();
  }

  dotsContainer.innerHTML = "";
  for (var i = 0; i < totalSlides; i++) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "hero__dot" + (i === 0 ? " hero__dot--active" : "");
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", i === 0);
    btn.setAttribute("aria-label", "Slide " + (i + 1));
    btn.addEventListener("click", function (idx) {
      return function () {
        goTo(idx);
      };
    }(i));
    dotsContainer.appendChild(btn);
  }

  if (prevBtn) prevBtn.addEventListener("click", function () { goTo(currentSlide - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { goTo(currentSlide + 1); });

  if (trackWrap) {
    var touchStartX = 0;
    var touchEndX = 0;
    var minSwipe = 50;

    trackWrap.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    trackWrap.addEventListener("touchend", function (e) {
      touchEndX = e.changedTouches[0].screenX;
      var diff = touchStartX - touchEndX;
      if (diff > minSwipe) {
        goTo(currentSlide + 1);
      } else if (diff < -minSwipe) {
        goTo(currentSlide - 1);
      }
    }, { passive: true });
  }

  var autoplayInterval = setInterval(function () {
    goTo(currentSlide + 1);
  }, 5000);

  track.addEventListener("mouseenter", function () {
    clearInterval(autoplayInterval);
  });
  track.addEventListener("mouseleave", function () {
    autoplayInterval = setInterval(function () {
      goTo(currentSlide + 1);
    }, 5000);
  });

  window.addEventListener("resize", updateSlider);
  updateSlider();
})();
