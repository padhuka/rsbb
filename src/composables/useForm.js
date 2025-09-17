// src/composables/useForm.js
import { ref, reactive, computed } from "vue";

export function useForm(initialValues = {}, validationRules = {}) {
  // State
  const form = reactive({ ...initialValues });
  const errors = ref({});
  const isSubmitting = ref(false);

  // Methods
  const validate = (field = null) => {
    if (field) {
      // Validate single field
      const rule = validationRules[field];
      if (rule) {
        const error = rule(form[field]);
        if (error) {
          errors.value[field] = error;
        } else {
          delete errors.value[field];
        }
      }
    } else {
      // Validate all fields
      errors.value = {};
      Object.keys(validationRules).forEach((key) => {
        const rule = validationRules[key];
        const error = rule(form[key]);
        if (error) {
          errors.value[key] = error;
        }
      });
    }
  };

  const reset = () => {
    Object.keys(form).forEach((key) => {
      form[key] = initialValues[key] || "";
    });
    errors.value = {};
  };

  const setField = (field, value) => {
    form[field] = value;
    validate(field);
  };

  // Computed
  const isValid = computed(() => Object.keys(errors.value).length === 0);
  const hasErrors = computed(() => Object.keys(errors.value).length > 0);

  return {
    // State
    form,
    errors,
    isSubmitting,

    // Computed
    isValid,
    hasErrors,

    // Methods
    validate,
    reset,
    setField,
  };
}
