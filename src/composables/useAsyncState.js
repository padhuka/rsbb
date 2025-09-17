import { ref } from "vue";

export function useAsyncState(asyncFn, initialState = null) {
  const state = ref(initialState);
  const isLoading = ref(false);
  const error = ref(null);

  const execute = async (...args) => {
    isLoading.value = true;
    error.value = null;

    try {
      const result = await asyncFn(...args);
      state.value = result;
      return result;
    } catch (err) {
      error.value = err;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    state,
    isLoading,
    error,
    execute,
  };
}
