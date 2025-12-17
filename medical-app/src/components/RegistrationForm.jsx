// src/components/RegistrationForm.jsx
import React, { useState } from "react";
// Đảm bảo bạn đã có file ErrorMessages.js chứa E0001, E0005...
import { ERROR_MESSAGES } from "../constants/ErrorMessages";
import "../App.css"; // File CSS đã tạo ở bước 6

// Hàm tiện ích thay thế {0}, {1} (Bạn có thể để ở utils/common.js rồi import vào)
const getMessage = (code, args = []) => {
  let message = ERROR_MESSAGES[code] || "";
  args.forEach((arg, index) => {
    message = message.replace(`{${index}}`, arg);
  });
  return message;
};

export default function RegistrationForm() {
  // 1. STATE: Sửa lại tên trường theo đúng DB và thiết kế
  const [form, setForm] = useState({
    examinationNumber: "", // Thay cho Name
    year: "",
    month: "",
    day: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(""); // Lỗi E0000 hiển thị ở đầu
  const [isSuccess, setIsSuccess] = useState(false);

  // Data cho dropdown ngày tháng
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 41 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 2. VALIDATE: Logic bám sát tài liệu thiết kế (Image 4 & 5)
  const validate = () => {
    const nextErrors = {};

    // (1) Check E0001: Bắt buộc nhập
    if (!form.examinationNumber.trim()) {
      // {0} -> 診察券番号 (Mã số khám bệnh)
      nextErrors.examinationNumber = getMessage("E0001", ["診察券番号"]);
    }
    if (!form.email.trim()) {
      nextErrors.email = getMessage("E0001", ["メールアドレス"]);
    }
    if (!form.password.trim()) {
      nextErrors.password = getMessage("E0001", ["パスワード"]);
    }

    // (2) Check ngày tháng (Phải chọn đủ mới check tiếp)
    if (!form.year || !form.month || !form.day) {
      // Nếu thiếu 1 trong 3 ô -> Báo lỗi E0001 cho ngày sinh
      // Logic phụ: Có thể báo lỗi riêng lẻ hoặc báo chung
      if (
        !nextErrors.examinationNumber &&
        !nextErrors.email &&
        !nextErrors.password
      ) {
        // Chỉ báo nếu các cái khác đã nhập (hoặc tùy logic bạn muốn)
        // Ở đây ta gán tạm vào biến birthday để hiển thị
      }
    } else {
      // Check E0005: Ngày không tồn tại (Ví dụ 31/02)
      const date = new Date(form.year, form.month - 1, form.day);
      if (
        date.getFullYear() != form.year ||
        date.getMonth() + 1 != form.month ||
        date.getDate() != form.day
      ) {
        nextErrors.birthday = getMessage("E0005", ["生年月日"]);
      }
    }

    // (3) Check E0019: Format Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.email && !emailRegex.test(form.email)) {
      nextErrors.email = getMessage("E0019", ["メールアドレス"]);
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setGeneralError(""); // Reset lỗi chung

    if (!validate()) {
      // Nếu có lỗi nhập liệu -> Hiện E0000 ở trên cùng
      setGeneralError(getMessage("E0000"));
      return;
    }

    // Giả lập gửi API thành công
    // Thực tế chỗ này sẽ gọi fetch/axios
    setIsSuccess(true);
  };

  const onCancel = () => {
    setForm({
      examinationNumber: "",
      year: "",
      month: "",
      day: "",
      email: "",
      password: "",
    });
    setErrors({});
    setGeneralError("");
  };

  // Màn hình thành công
  if (isSuccess) {
    return (
      <div className="container">
        <div className="banner">アプリのタイトルバナー</div>
        <div className="success-message">
          仮登録が完了しました。
          <br />
          登録したメールアドレスに送信された
          <br />
          メールをご確認ください。
        </div>
      </div>
    );
  }

  // Màn hình nhập liệu
  return (
    <div className="container">
      <div className="banner">アプリのタイトルバナー</div>

      <form onSubmit={onSubmit} className="form-content">
        {/* Khu vực hiển thị lỗi E0000 */}
        {generalError && (
          <div className="error-message-box">{generalError}</div>
        )}

        <div className="intro-text">
          「アプリ名」にログインします。
          <br />
          診察券情報を入力してください。
          <br />
          メールアドレスに確認用のメールを送信します。
        </div>

        {/* Mã số khám bệnh */}
        <div className="form-group">
          <label>診察券番号</label>
          {errors.examinationNumber && (
            <div className="error-text">{errors.examinationNumber}</div>
          )}
          <input
            name="examinationNumber"
            value={form.examinationNumber}
            onChange={onChange}
            maxLength={11}
          />
        </div>

        {/* Ngày sinh (3 Dropdown) */}
        <div className="form-group">
          <label>生年月日</label>
          {errors.birthday && (
            <div className="error-text">{errors.birthday}</div>
          )}
          <div className="date-picker">
            <select name="year" value={form.year} onChange={onChange}>
              <option value="">----</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>{" "}
            年
            <select name="month" value={form.month} onChange={onChange}>
              <option value="">--</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>{" "}
            月
            <select name="day" value={form.day} onChange={onChange}>
              <option value="">--</option>
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>{" "}
            日
          </div>
        </div>

        {/* Email */}
        <div className="form-group">
          <label>メールアドレス</label>
          {errors.email && <div className="error-text">{errors.email}</div>}
          <input
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="Email"
          />
        </div>

        {/* Mật khẩu */}
        <div className="form-group">
          <label>パスワード</label>
          {errors.password && (
            <div className="error-text">{errors.password}</div>
          )}
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="Passowrd"
          />
        </div>

        <div className="button-group">
          <button type="submit" className="btn-login">
            ログイン
          </button>
          <button type="button" onClick={onCancel} className="btn-cancel">
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}
