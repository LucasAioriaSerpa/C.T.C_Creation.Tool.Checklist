import { SendFormData } from "../sendFormData";
const TOKEN_KEY = 'user_token'

export const Login = async (email, password) => {
    const data = { email, password }
    const response = await SendFormData(data, '/API/login')
    localStorage.setItem(TOKEN_KEY, response.token)
    return response
}
