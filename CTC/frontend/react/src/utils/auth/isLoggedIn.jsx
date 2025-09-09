import { SendFormData } from "../sendFormData";
const TOKEN_KEY = 'user_token'

export const IsLoggedIn = () => { return localStorage.getItem(TOKEN_KEY) !== null }
