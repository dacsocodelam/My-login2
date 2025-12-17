class PeopleController < ApplicationController
  # --- HÀM LOGIN (BẢN DEBUG CHI TIẾT) ---
  def login
    puts "\n========== CHECK LOGIN =========="
    
    # 1. Lấy dữ liệu từ React
    email_input = params[:email]
    pass_input = params[:password]
    exam_num_input = params[:examination_number]
    birthday_input = params[:birthday]

    # 2. Tìm User
    user = Person.find_by(email: email_input)

    if user
      # 3. So sánh từng món
      # (Chuyển hết về chuỗi to_s để so sánh cho dễ)
      check_pass = (user.password == pass_input)
      check_exam = (user.examination_number.to_s == exam_num_input.to_s)
      check_birth = (user.birthday.to_s == birthday_input.to_s)

      # --- IN RA MÀN HÌNH ĐEN ĐỂ KIỂM TRA ---
      puts "User Found: #{user.email}"
      puts "------------------------------------------------"
      puts "- Check Pass:  #{check_pass} | DB: '#{user.password}' vs Input: '#{pass_input}'"
      puts "- Check Exam:  #{check_exam} | DB: '#{user.examination_number}' vs Input: '#{exam_num_input}'"
      puts "- Check Birth: #{check_birth}"
      puts "   + DB đang lưu:   '#{user.birthday}'"
      puts "   + Web gửi lên:   '#{birthday_input}'"
      puts "------------------------------------------------"

      if check_pass && check_exam && check_birth
        render json: { status: 'success', message: 'Login OK!', user: user }
      else
        render json: { status: 'error', message: 'Thông tin nhập vào không khớp!' }, status: :unauthorized
      end
    else
      puts "User Not Found: #{email_input}"
      render json: { status: 'error', message: 'Không tìm thấy Email này!' }, status: :unauthorized
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