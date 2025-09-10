
const API_URL = import.meta.env.VITE_API_URL;

const authService = {
    async login(email, password) {
        const response = await fetch(`${API_URL}/API/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Falha no login')
        }
        const data = await response.json()
        if (data.token) {
            localStorage.setItem('userToken', data.token)
            localStorage.setItem('userId', data.id_auditor)
            localStorage.setItem('nome', data.nome)
            localStorage.setItem('email', data.email)
        }
        return data
    },
    isLoggedIn() {
        return !! localStorage.getItem('userToken');
    },
    logout() {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userId')
        localStorage.removeItem('nome')
        localStorage.removeItem('email')
    },
    getToken()      { return localStorage.getItem('userToken')  },
    getUserId()     { return localStorage.getItem('userId')     },
    getUserNome()   { return localStorage.getItem('nome')       },
    getUserEmail()  { return localStorage.getItem('email')      }
}

export default authService