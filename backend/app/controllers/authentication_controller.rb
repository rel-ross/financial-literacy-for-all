class AuthenticationController < ApplicationController

    def login
        @user = User.find_by({ username: params[:username] })

        if !@user
            render json: { error: "User/Password does not match our records" }, status: :unauthorized
        else
            if !@user.authenticate params[:password]
                render json: { error: "User/Password does not match our records" }, status: :unauthorized
            else
                payload= {
                    iat: Time.now.to_i,
                    user_id: @user.id
                }
                secret = "canbeliterallyanything"
                token = JWT.encode payload, secret

                render json: { token: token }, status: :created
            end
        end
    end
end
