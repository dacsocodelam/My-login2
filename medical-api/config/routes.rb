Rails.application.routes.draw do
  resources :people
  
  # Thêm dòng này: Tạo đường dẫn POST cho chức năng đăng nhập
  post '/login', to: 'people#login'
end