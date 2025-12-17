class CreatePeople < ActiveRecord::Migration[8.0]
  def change
    # Tạo bảng 'people' (số nhiều của person)
    create_table :person, comment: '個人情報 (Thông tin cá nhân)' do |t|
      
      t.integer :examination_number, comment: '診察券番号'
      t.string :family_name, comment: '姓 '
      t.string :family_name_kana, comment: '姓カナ '
      t.string :first_name, comment: '名 '
      t.string :first_name_kana, comment: '名カナ '
      
      t.integer :gender_type, comment: '性別タイプ ' 
      t.date :birthday, comment: '生年月日 '
      t.string :email, comment: 'メールアドレス'
      t.string :password, comment: 'パスワード'
      t.string :zip, limit: 7, comment: '郵便番号'
      t.text :address, comment: '住所'
      
      t.datetime :applied, comment: '申請日時'
      t.datetime :lastlogin, comment: '最終ログイン日時'
      t.datetime :withdrawal_date, comment: '退会日時'

      # Các trường audit log như trong hình yêu cầu
      t.datetime :created, comment: '作成日時'
      t.integer :created_user_id, comment: '作成担当者ID'
      t.datetime :modified, comment: '更新日時'
      t.integer :modified_user_id, comment: '変更担当者ID'
      
      t.datetime :deleted, comment: '削除日時'
      t.boolean :deleted_flag, default: false, comment: '削除フラグ'

      t.timestamps # Cái này tự tạo created_at và updated_at chuẩn Rails
    end
  end
end