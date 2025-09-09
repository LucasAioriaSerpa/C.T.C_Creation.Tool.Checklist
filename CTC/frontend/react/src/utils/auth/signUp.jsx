import { SendFormData } from "../sendFormData";
const TOKEN_KEY = 'user_token'

export const SignUp = async (nome, email, password) => {
    const data = { nome, email, password }
    const response = await SendFormData(data, '/API/cadastro')
    return response
}
