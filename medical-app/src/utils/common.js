// src/utils/common.js
import { ERROR_MESSAGES } from '../constants/ErrorMessages';

// --- HÀM CỦA BẠN (GIỮ NGUYÊN) ---
export const getMessage = (code, args = []) => {
  let message = ERROR_MESSAGES[code] || "";
  args.forEach((arg, index) => {
    // Thay thế {0}, {1} bằng giá trị thực
    message = message.replace(`{${index}}`, arg);
  });
  return message;
};

// --- BỔ SUNG THÊM 2 HÀM NÀY ĐỂ CHECK LỖI ---

/**
 * Kiểm tra định dạng Email (Phải có @ và dấu chấm)
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Kiểm tra ngày tháng có tồn tại không (Ví dụ: 31/02 là sai)
 */
export const isValidDate = (year, month, day) => {
  const y = parseInt(year);
  const m = parseInt(month);
  const d = parseInt(day);
  const date = new Date(y, m - 1, d);
  
  return date.getFullYear() === y &&
         date.getMonth() === m - 1 &&
         date.getDate() === d;
};