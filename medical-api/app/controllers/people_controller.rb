class PeopleController < ApplicationController
  # --- HÀM XỬ LÝ KÍCH HOẠT / ĐĂNG KÝ TẠM (PHIÊN BẢN CÓ XUẤT FILE MAIL) ---
  def login
    puts "\n========== CHECK USER EXISTENCE (SIMPLE) =========="
    
    # 1. Lấy dữ liệu Input
    email_input = params[:email]
    pass_input = params[:password] 
    exam_num_input = params[:examination_number]
    birthday_input = params[:birthday]

    # 2. TÌM KIẾM NGƯỜI DÙNG (EXISTENCE CHECK)
    # Điều kiện: Khớp Mã số + Ngày sinh + Email + Chưa bị xóa
    user = Person.find_by(
      examination_number: exam_num_input,
      birthday: birthday_input,
      email: email_input,
      deleted_flag: false 
    )

    if user
      puts "=> TÌM THẤY USER ID: #{user.id}"

      # --- 3. THỰC HIỆN ĐĂNG KÝ TẠM ---
      puts "=> Tiến hành cập nhật Password & Thời gian..."
      
      if user.update(
        password: pass_input,   # Ghi đè mật khẩu mới
        applied: Time.now       # Cập nhật thời gian nộp (applied)
      )
        puts "=> UPDATE THÀNH CÔNG!"
        
        # =======================================================
        # (3)-2. GỌI HÀM XUẤT FILE EMAIL RA TEXT
        # =======================================================
        output_email_file(user)
        # =======================================================

        # SỬ DỤNG FILE MÃ LỖI: Gọi mã S0001
        render json: { 
          status: 'success', 
          message: ApiMessage.get("S0001"), # "仮登録が完了しました。"
          user: user 
        }
      else
        # SỬ DỤNG FILE MÃ LỖI: Gọi mã ERR_DB
        render json: { 
          status: 'error', 
          message: ApiMessage.get("ERR_DB") 
        }, status: :unprocessable_entity
      end

    else
      # --- TRƯỜNG HỢP KHÔNG TÌM THẤY (M0103) ---
      puts "=> KHÔNG TÌM THẤY USER (M0103)"
      
      # SỬ DỤNG FILE MÃ LỖI: Gọi mã M0103
      render json: { 
        status: 'error', 
        message: ApiMessage.get("M0103") # "入力内容に誤りがあるか、またはご登録がありません。"
      }, status: :unauthorized
    end
  end

  # --- CÁC HÀM KHÁC (GIỮ NGUYÊN) ---
  def index
    @people = Person.all.order(created_at: :desc) 
    render json: @people
  end

  def create
    @person = Person.new(person_params)
    if @person.save
      render json: @person, status: :created
    else
      render json: @person.errors, status: :unprocessable_entity
    end
  end

  private

  def person_params
    params.require(:person).permit(:family_name, :first_name, :examination_number, :email, :password, :birthday)
  end

  # =======================================================
  # (MỚI) HÀM XUẤT FILE EMAIL (Giả lập gửi mail theo Spec)
  # =======================================================
  def output_email_file(user)
    # 1. Định nghĩa thư mục lưu trữ: tmp/emails
    folder_path = Rails.root.join('tmp', 'emails')
    
    # Tạo thư mục nếu chưa có
    FileUtils.mkdir_p(folder_path) unless Dir.exist?(folder_path)

    # 2. Tạo tên file duy nhất theo định dạng thời gian và email
    timestamp = Time.now.strftime("%Y%m%d_%H%M%S")
    file_name = "mail_#{timestamp}_#{user.email}.txt"
    file_path = folder_path.join(file_name)

    # 3. Soạn nội dung Email theo văn phong Nhật Bản (Mẫu 仮登録完了)
    content = <<~EMAIL_CONTENT
      ------------------------------------------------------------
      送信先: #{user.email}
      件名: 【重要】仮登録完了のお知らせ
      送信日時: #{Time.now.strftime("%Y/%m/%d %H:%M:%S")}
      ------------------------------------------------------------

      #{user.family_name} #{user.first_name} 様

      アプリへの仮登録が完了いたしました。
      まだ本登録は完了しておりませんのでご注意ください。

      以下のURLをクリックして、本登録を完了させてください。

      http://localhost:5173/verify?id=#{user.id}

      ------------------------------------------------------------
      ※本メールはシステムより自動送信されています。
    EMAIL_CONTENT

    # 4. Ghi nội dung vào file text
    File.open(file_path, 'w') do |file|
      file.write(content)
    end

    puts "=> ĐÃ XUẤT FILE EMAIL THÀNH CÔNG: #{file_path}"
  end
end