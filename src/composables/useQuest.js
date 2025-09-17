// src/composables/useQuest.js
import { ref, computed } from "vue";

export function useQuest(pages = []) {
  // State
  const currentPageIndex = ref(0);
  const questPages = ref(pages);
  const isCompleted = ref(false);

  // Computed
  const currentPage = computed(() => questPages.value[currentPageIndex.value]);
  const isFirstPage = computed(() => currentPageIndex.value === 0);
  const isLastPage = computed(
    () => currentPageIndex.value === questPages.value.length - 1
  );
  const progress = computed(
    () => ((currentPageIndex.value + 1) / questPages.value.length) * 100
  );

  // Methods
  const nextPage = () => {
    if (!isLastPage.value) {
      currentPageIndex.value++;
    }
  };

  const previousPage = () => {
    if (!isFirstPage.value) {
      currentPageIndex.value--;
    }
  };

  const goToPage = (index) => {
    if (index >= 0 && index < questPages.value.length) {
      currentPageIndex.value = index;
    }
  };

  const complete = () => {
    isCompleted.value = true;
  };

  const restart = () => {
    currentPageIndex.value = 0;
    isCompleted.value = false;
  };

  const addPage = (page) => {
    questPages.value.push(page);
  };

  const removePage = (index) => {
    if (index >= 0 && index < questPages.value.length) {
      questPages.value.splice(index, 1);

      // Adjust current page index if necessary
      if (currentPageIndex.value >= questPages.value.length) {
        currentPageIndex.value = questPages.value.length - 1;
      }
    }
  };

  return {
    // State
    currentPageIndex,
    questPages,
    isCompleted,

    // Computed
    currentPage,
    isFirstPage,
    isLastPage,
    progress,

    // Methods
    nextPage,
    previousPage,
    goToPage,
    complete,
    restart,
    addPage,
    removePage,
  };
}
