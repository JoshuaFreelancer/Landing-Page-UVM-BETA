import { trackEvent } from "./analytics";

const REGEX = {
  nombre: /^[A-Za-zÀ-ÿ\s]{3,80}$/,
  correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  ciudad: /^[A-Za-zÀ-ÿ\s]{2,80}$/,
  telefono: /^\+?[0-9\s\-()]{7,20}$/,
};

function sanitizeValue(value) {
  return value.trim();
}

function validateField(name, value) {
  const cleanValue = sanitizeValue(value);

  if (!cleanValue) {
    return "Este campo es obligatorio.";
  }

  if (!REGEX[name] || REGEX[name].test(cleanValue)) {
    return "";
  }

  switch (name) {
    case "nombre":
      return "Ingresa un nombre valido (solo letras y espacios).";
    case "correo":
      return "Ingresa un correo electronico valido.";
    case "ciudad":
      return "Ingresa una ciudad valida (solo letras y espacios).";
    case "telefono":
      return "Ingresa un telefono valido con al menos 7 digitos.";
    default:
      return "Dato invalido.";
  }
}

function setFieldError(input, message) {
  const errorContainer = document.querySelector(`[data-error-for='${input.name}']`);
  input.classList.toggle("field-invalid", Boolean(message));

  if (errorContainer) {
    errorContainer.textContent = message;
  }
}

function setFormMessage(messageNode, message, type) {
  messageNode.textContent = message;
  messageNode.classList.remove("is-success", "is-error");

  if (type) {
    messageNode.classList.add(type);
  }
}

function buildPayload(formData) {
  return {
    nombre: sanitizeValue(formData.get("nombre") || ""),
    correo: sanitizeValue(formData.get("correo") || ""),
    ciudad: sanitizeValue(formData.get("ciudad") || ""),
    telefono: sanitizeValue(formData.get("telefono") || ""),
    comentarios: sanitizeValue(formData.get("comentarios") || ""),
  };
}

export function initLeadForm() {
  const form = document.querySelector("#lead-form");
  const submitButton = document.querySelector("[data-submit-btn]");
  const messageNode = document.querySelector("[data-form-message]");

  if (!form || !submitButton || !messageNode) {
    return;
  }

  const requiredInputs = ["nombre", "correo", "ciudad", "telefono"]
    .map((fieldName) => form.querySelector(`[name='${fieldName}']`))
    .filter(Boolean);

  requiredInputs.forEach((input) => {
    input.addEventListener("input", () => {
      const errorMessage = validateField(input.name, input.value);
      setFieldError(input, errorMessage);
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    let hasErrors = false;

    requiredInputs.forEach((input) => {
      const errorMessage = validateField(input.name, input.value);
      setFieldError(input, errorMessage);
      if (errorMessage) {
        hasErrors = true;
      }
    });

    if (hasErrors) {
      trackEvent("form_submit_validation_error", {
        fieldsWithError: requiredInputs
          .filter((input) => input.classList.contains("field-invalid"))
          .map((input) => input.name),
      });
      setFormMessage(messageNode, "Corrige los campos marcados para continuar.", "is-error");
      return;
    }

    const formData = new FormData(form);
    const payload = buildPayload(formData);

    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";
    setFormMessage(messageNode, "", "");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "No se pudo enviar la solicitud.");
      }

      form.reset();
      requiredInputs.forEach((input) => setFieldError(input, ""));
      trackEvent("form_submit_success", {
        endpoint: form.action,
      });
      setFormMessage(
        messageNode,
        "Solicitud enviada con exito. Te contactaremos en menos de 24 horas.",
        "is-success"
      );
    } catch (error) {
      trackEvent("form_submit_fail", {
        endpoint: form.action,
        reason: error.message || "network_error",
      });
      setFormMessage(
        messageNode,
        error.message || "Error de conexion. Intenta nuevamente.",
        "is-error"
      );
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Enviar solicitud";
    }
  });
}
