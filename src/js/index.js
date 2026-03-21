import "../css/styles.css";
import { initNavigation } from "./modules/navigation";
import { initProgramCarousel } from "./modules/carousel";
import { initLeadForm } from "./modules/form";
import { initRevealOnScroll } from "./modules/reveal";
import { initABTesting } from "./modules/abTesting";
import { initCTAEventTracking } from "./modules/analytics";

document.addEventListener("DOMContentLoaded", () => {
  initABTesting();
  initNavigation();
  initProgramCarousel();
  initCTAEventTracking();
  initLeadForm();
  initRevealOnScroll();
});
