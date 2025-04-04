const API_URL = 'http://localhost:5251/'

export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro no login');
        }

        const data = await response.json();
        console.log('Login bem-sucedido:', data);
        return data;
    } catch (error) {
        console.error('Erro no login:', error);
        throw error;
    }
};

export const register = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}register`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            console.log('Registo bem sucedido!');
            return { message: 'Registo bem sucedido' };
        }

        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro no registo');
    } catch (error) {
        console.error('Erro no registo:', error);
        throw error;
    }
};