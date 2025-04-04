const API_URL = 'http://localhost:5251/'

export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify({ email, password}),
        });
        if (!response.ok) {
            throw new Error('Erro no login')
        }
        const data = await response.json()
        console.log('Login bem-sucedido:', data)
        return data

    } catch (error) {
        console.error('Erro no login:', error)
    }
}

export const register = async (email, password, password2) => {
    try {
        const response = await fetch(`${API_URL}register`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
              },
            body: JSON.stringify({ email, password, password2}),
        });
        if (!response.ok) {
            throw new Error('Erro no registo')
        }
        const data = await response.json()
        console.log('Registo bem sucedido:', data)
        return data
    } catch (error) {
        console.log('Erro no registo:', error)
    }
}