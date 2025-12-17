// src/components/LoginForm.jsx
import React, { useState } from "react";
import "./LoginForm.css";
import { getMessage, isValidEmail, isValidDate } from "../utils/common";

const LoginForm = ({ onLoginSuccess }) => {
  // 1. Định nghĩa dữ liệu mặc định ban đầu (để dùng lại khi Reset)
  const INITIAL_DATA = {
    examination_number: "",
    email: "",
    password: "",
    year: "1985",
    month: "07",
    day: "19",
  };

  // State lưu dữ liệu nhập (Khởi tạo bằng dữ liệu mặc định)
  const [formData, setFormData] = useState(INITIAL_DATA);

  // State lưu danh sách lỗi
  const [errors, setErrors] = useState({});

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const years = Array.from({ length: 100 }, (_, i) => 1930 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // --- HÀM XỬ LÝ NÚT CANCEL (MỚI THÊM) ---
  const handleCancel = () => {
    // 1. Reset dữ liệu về ban đầu (Xóa trắng ô nhập)
    setFormData(INITIAL_DATA);
    // 2. Xóa sạch các thông báo lỗi đỏ (nếu đang hiện)
    setErrors({});
  };
  // ---------------------------------------

  const validate = () => {
    let newErrors = {};
    let hasError = false;

    if (!formData.examination_number.trim()) {
      newErrors.examination_number = getMessage("E0001", ["診察券番号"]);
      hasError = true;
    }

    if (!isValidDate(formData.year, formData.month, formData.day)) {
      newErrors.birthday = getMessage("E0005", ["生年月日"]);
      hasError = true;
    }

    if (!formData.email.trim()) {
      newErrors.email = getMessage("E0001", ["メールアドレス"]);
      hasError = true;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = getMessage("E0019") || "Format Error";
      hasError = true;
    }

    if (!formData.password) {
      newErrors.password = getMessage("E0001", ["パスワード"]);
      hasError = true;
    }

    if (hasError) {
      newErrors.global = getMessage("E0000");
    }

    setErrors(newErrors);
    return !hasError;
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const fullBirthday = `${formData.year}-${formData.month.padStart(
      2,
      "0"
    )}-${formData.day.padStart(2, "0")}`;

    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        examination_number: formData.examination_number,
        birthday: fullBirthday,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          onLoginSuccess();
        } else {
          setErrors({ global: data.message || "エラー。" });
        }
      })
      .catch(() => setErrors({ global: "サーバー接続エラー！" }));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">アプリのタイトルバナー</div>
        <div className="login-body">
          <p className="intro-text">
            「医療」にログインします。
            <br />
            診察券情報を入力してください。
            <br />
            メールアドレスに確認用のメールを送信します。
          </p>

          {errors.global && (
            <div className="global-error-box">❌ {errors.global}</div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">診察券番号</label>
              {errors.examination_number && (
                <span className="error-text">{errors.examination_number}</span>
              )}
              <input
                type="text"
                name="examination_number"
                value={formData.examination_number}
                onChange={handleChange}
                className={`form-input ${
                  errors.examination_number ? "input-error" : ""
                }`}
                placeholder="1234567890"
              />
            </div>

            <div className="form-group">
              <label className="form-label">生年月日</label>
              {errors.birthday && (
                <span className="error-text">{errors.birthday}</span>
              )}
              <div className="date-group">
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="date-select"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <span>年</span>
                <select
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  className="date-select"
                >
                  {months.map((m) => (
                    <option key={m} value={m.toString().padStart(2, "0")}>
                      {m.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <span>月</span>
                <select
                  name="day"
                  value={formData.day}
                  onChange={handleChange}
                  className="date-select"
                >
                  {days.map((d) => (
                    <option key={d} value={d.toString().padStart(2, "0")}>
                      {d.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <span>日</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">メールアドレス</label>
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? "input-error" : ""}`}
                placeholder="Email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">パスワード</label>
              {errors.password && (
                <span className="error-text">{errors.password}</span>
              )}
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? "input-error" : ""}`}
                placeholder="Password"
              />
            </div>

            <div className="button-group">
              <button type="submit" className="btn-login">
                ログイン
              </button>

              {/* Gắn hàm handleCancel vào nút Cancel */}
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
