Rails.application.routes.draw do
  resources :users
  resources :pages
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  post "users", to: "users#create"
  post "login", to: "authentication#login"
end
