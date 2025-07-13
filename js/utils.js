// ==========================================
// VALIDATION & UTILITIES
// ==========================================

export const Validators = {
  isPositiveInteger: (value) => Number.isInteger(value) && value >= 0,
  isValidRange: (value, min, max) => value >= min && value <= max,
  isNotEmpty: (value) => value && value.toString().trim().length > 0,
  isLength: (value, max) => value.length <= max,

  validateKingdomName: (name) => {
    if (!Validators.isNotEmpty(name)) throw new Error("Kingdom name cannot be empty.");
    if (!Validators.isLength(name, 50)) throw new Error("Kingdom name must be 50 characters or less.");
    return true;
  },
  validateLevel: (level) => {
    if (!Validators.isPositiveInteger(level)) throw new Error("Level must be a positive integer.");
    if (!Validators.isValidRange(level, 1, 20)) throw new Error("Level must be between 1 and 20.");
    return true;
  },
  validateResource: (value, resourceName) => {
    if (!Number.isInteger(value)) throw new Error(`${resourceName} must be a whole number.`);
    if (value < 0) throw new Error(`${resourceName} cannot be negative.`);
    return true;
  },
};

export function safeOperation(operation, errorMessage = "An error occurred") {
  try {
    return operation();
  } catch (error) {
    console.error(errorMessage, error);
    UIkit.notification({
      message: `${errorMessage}: ${error.message}`,
      status: "danger",
      pos: "top-center",
      timeout: 5000,
    });
    return null;
  }
}

export function handleValidatedInput(element, validator, onSuccess) {
  try {
    const value = element.type === "number" ? parseInt(element.value, 10) : element.value;
    if (validator(value)) {
      onSuccess(value);
    }
  } catch (error) {
    UIkit.notification({ message: error.message, status: "danger", pos: "top-center" });
    element.classList.add("uk-form-danger");
    setTimeout(() => element.classList.remove("uk-form-danger"), 3000);
  }
}

export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

