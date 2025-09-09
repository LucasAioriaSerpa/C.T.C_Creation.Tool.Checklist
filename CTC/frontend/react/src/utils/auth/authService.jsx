import { SendData } from "../sendData"

const TOKEN_KEY = 'user_token'

class AuthService {
    constructor() {
        this.TOKEN = localStorage.getItem(TOKEN_KEY) || null
    }
    async login(email, password) {
        try {
            const data = { email, password }
            const response = await SendData('/API/login', data)
            if (response.token) {
                this.token = response.token
                localStorage.setItem(TOKEN_KEY, this.token)
                return response
            }
            throw new Error("Token não encontrado!")
        } catch (error) {
            this.logout()
            throw error
        }
    }

    logout() {
        this.token = null
        localStorage.removeItem(TOKEN_KEY)
    }

    isLoggedIn() {
        return this.token != null
    }

    getToken() {
        return this.token
    }

}

export default new AuthService()