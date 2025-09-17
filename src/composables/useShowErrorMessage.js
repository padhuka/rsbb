import { Dialog } from 'quasar'

export function useShowErrorMessage(message) {
  Dialog.create({
    title: 'Error',
    message: message,
    ok: {
      label: 'OK',
      color: 'negative',
    },
  })
}
