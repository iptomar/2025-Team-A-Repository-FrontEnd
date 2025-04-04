import axios from 'axios';
const API_URL = "https://localhost:7008";
//POSTS

// Função para fazer fazer o register
export async function register(email, pass) {
    try {
        const response = await axios.post(API_URL + "/register", {
            email: email,
            password: pass,
        });

        return response.data; // Retorna apenas os dados da resposta
    } catch (error) {
        console.error("Erro ao criar a conta", error);
        throw error; // Lança o erro para ser tratado pelo código chamador
    }
}
