// src/composables/useNotification.js
import { useQuasar } from "quasar";

export function useNotification() {
  const $q = useQuasar();

  const notify = {
    success: (message, options = {}) => {
      $q.notify({
        type: "positive",
        message,
        position: "top",
        timeout: 3000,
        ...options,
      });
    },

    error: (message, options = {}) => {
      $q.notify({
        type: "negative",
        message,
        position: "top",
        timeout: 5000,
        ...options,
      });
    },

    warning: (message, options = {}) => {
      $q.notify({
        type: "warning",
        message,
        position: "top",
        timeout: 4000,
        ...options,
      });
    },

    info: (message, options = {}) => {
      $q.notify({
        type: "info",
        message,
        position: "top",
        timeout: 3000,
        ...options,
      });
    },
  };

  const dialog = {
    confirm: (title, message) => {
      return new Promise((resolve) => {
        $q.dialog({
          title,
          message,
          cancel: true,
          persistent: true,
        })
          .onOk(() => {
            resolve(true);
          })
          .onCancel(() => {
            resolve(false);
          });
      });
    },

    prompt: (title, message, model = "") => {
      return new Promise((resolve, reject) => {
        $q.dialog({
          title,
          message,
          prompt: {
            model,
            type: "text",
          },
          cancel: true,
          persistent: true,
        })
          .onOk((data) => {
            resolve(data);
          })
          .onCancel(() => {
            reject(new Error("Dialog cancelled"));
          });
      });
    },
  };

  return {
    notify,
    dialog,
  };
}
