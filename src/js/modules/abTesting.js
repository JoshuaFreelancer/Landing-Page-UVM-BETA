import { trackEvent } from "./analytics";

const STORAGE_KEY = "uvm_ab_variant";

const variants = {
  a: {
    kicker: "Inscripciones 2026 abiertas",
    headline: "Construye una carrera con futuro desde hoy en UVM",
    copy:
      "En la Universidad Valle del Momboy te formamos para liderar, innovar y transformar tu entorno con una educacion humana, practica y de vanguardia.",
    primaryCta: "Solicitar informacion",
    secondaryCta: "Ver carreras",
    navCta: "Reserva tu cupo",
  },
  b: {
    kicker: "Cupos limitados para nuevo ingreso",
    headline: "Da el salto universitario que acelera tu futuro profesional",
    copy:
      "Estudia en UVM con acompanamiento academico real, docentes expertos y una ruta clara para convertirte en un profesional competitivo.",
    primaryCta: "Quiero mi asesoria",
    secondaryCta: "Comparar carreras",
    navCta: "Quiero preinscribirme",
  },
};

function getVariantFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const value = params.get("ab");
  return value && variants[value] ? value : "";
}

function selectVariant() {
  const fromQuery = getVariantFromQuery();
  if (fromQuery) {
    localStorage.setItem(STORAGE_KEY, fromQuery);
    return fromQuery;
  }

  const fromStorage = localStorage.getItem(STORAGE_KEY);
  if (fromStorage && variants[fromStorage]) {
    return fromStorage;
  }

  const random = Math.random() < 0.5 ? "a" : "b";
  localStorage.setItem(STORAGE_KEY, random);
  return random;
}

function applyVariantContent(variant) {
  const copy = variants[variant];
  Object.entries(copy).forEach(([key, value]) => {
    const element = document.querySelector(`[data-ab='${key}']`);
    if (element) {
      element.textContent = value;
    }
  });
}

export function initABTesting() {
  const variant = selectVariant();
  document.body.dataset.abVariant = variant;
  applyVariantContent(variant);

  trackEvent("ab_variant_exposure", {
    variant,
  });
}
