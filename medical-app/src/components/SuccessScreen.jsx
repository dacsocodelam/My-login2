// src/components/SuccessScreen.jsx
import React from 'react';
import './SuccessScreen.css'; // <--- Import file CSS vừa tạo

const SuccessScreen = () => {
  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-header">
         医療アプリ
        </div>
        <div className="success-body">
          <div className="success-message">
            <p className="success-text">
              仮登録が完了しました。<br/>
              登録したメールアドレスに送信された<br/>
              メールをご確認ください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;