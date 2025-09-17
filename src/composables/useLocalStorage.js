// src/composables/useLocalStorage.js
import { ref, watch } from "vue";

export function useLocalStorage(key, defaultValue = null) {
  // Get initial value from localStorage
  const storedValue = localStorage.getItem(key);
  const initialValue = storedValue ? JSON.parse(storedValue) : defaultValue;

  // Create reactive ref
  const value = ref(initialValue);

  // Watch for changes and update localStorage
  watch(
    value,
    (newValue) => {
      if (newValue === null || newValue === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    },
    { deep: true }
  );

  // Method to remove from localStorage
  const remove = () => {
    value.value = null;
  };

  return [value, remove];
}
