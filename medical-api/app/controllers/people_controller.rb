class PeopleController < ApplicationController
  # --- HÀM XỬ LÝ KÍCH HOẠT / ĐĂNG KÝ TẠM (PHIÊN BẢN RÚT GỌN) ---
  def login
    puts "\n========== CHECK USER EXISTENCE (SIMPLE) =========="
    
    # 1. Lấy dữ liệu Input
    email_input = params[:email]
    pass_input = params[:password]        # Password mới để update
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

      # --- 3. THỰC HIỆN ĐĂNG KÝ TẠM LUÔN (BỎ QUA CHECK M0109, M0110) ---
     puts "=> Tiến hành cập nhật Password & Thời gian..."
      
      if user.update(
        password: pass_input,   # Ghi đè mật khẩu mới
        applied: Time.now       # Cập nhật thời gian nộp
      )
        puts "=> UPDATE THÀNH CÔNG!"
        
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
        message: ApiMessage.get("M0103") # "M0103: Thông tin nhập vào..."
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
end