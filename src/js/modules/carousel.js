export function initProgramCarousel() {
  const track = document.querySelector("[data-carousel-track]");
  const slides = Array.from(document.querySelectorAll("[data-slide]"));
  const prevBtn = document.querySelector("[data-prev]");
  const nextBtn = document.querySelector("[data-next]");

  if (!track || !slides.length || !prevBtn || !nextBtn) {
    return;
  }

  let currentIndex = 0;

  const render = () => {
    track.style.transform = `translateX(${-currentIndex * 100}%)`;
  };

  const goNext = () => {
    currentIndex = (currentIndex + 1) % slides.length;
    render();
  };

  const goPrev = () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    render();
  };

  prevBtn.addEventListener("click", goPrev);
  nextBtn.addEventListener("click", goNext);

  setInterval(goNext, 8000);
  render();
}
