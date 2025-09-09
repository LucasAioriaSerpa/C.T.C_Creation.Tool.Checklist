import { SendFormData } from "../sendFormData";
const TOKEN_KEY = 'user_token'

export const logout = () => { localStorage.removeItem(TOKEN_KEY) }
