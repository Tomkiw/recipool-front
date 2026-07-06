// 1. Імпорт стилів залишаємо зверху — CSS безпечний для сервера
import 'izitoast/dist/css/iziToast.min.css';

// 2. Робимо функцію асинхронною, щоб використовувати await
export const showSuccessToast = async (message: string, title = 'Success') => {
  // 3. Динамічно імпортуємо iziToast ТІЛЬКИ в момент виклику (коли ми вже в браузері)
  const iziToast = (await import('izitoast')).default;

  iziToast.success({
    title,
    message,
    position: 'topRight',
  });
};

export const showErrorToast = async (message: string, title = 'Error') => {
  const iziToast = (await import('izitoast')).default;

  iziToast.error({
    title,
    message,
    position: 'topRight',
  });
};
