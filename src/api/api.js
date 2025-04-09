import axios from "axios";
const API_URL = "http://localhost:7008/";

//GETS

//Vai buscar todos os docentes
export const getDocentes = async () => {
  try {
    const response = await axios.get(API_URL + "api/API_Docentes");
    console.log("Dados recebidos:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao ir buscar os docentes:", error);
  }
};

//Vai buscar todas as manchas horárias
export const getManchasHorarias = async () => {
    try {
      const response = await axios.get(API_URL + "api/API_ManchasHorarias");
      console.log("Dados recebidos:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao ir buscar os docentes:", error);
    }
  };
  
//POSTS
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro no login");
    }

    const data = await response.json();
    console.log("Login bem-sucedido:", data);
    return data;
  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
};

export const register = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      console.log("Registo bem sucedido!");
      return { message: "Registo bem sucedido" };
    }

    const errorData = await response.json();
    throw new Error(errorData.message || "Erro no registo");
  } catch (error) {
    console.error("Erro no registo:", error);
    throw error;
  }
};

//Cria mancha horária
export const adicionarManchaHoraria = async (aula) => {
    try {
        // Criar um objeto FormData para enviar os dados como formulário
        const formData = new FormData();
        
        formData.append("tipoAula", aula.tipoAula);
        formData.append("numSlots", aula.numSlots);
        formData.append("horaInicio", aula.horaInicio);
        formData.append("diaSemana", aula.diaSemana);
        formData.append("docenteFK", aula.docenteFK);
        formData.append("salaFK", aula.salaFK);
        formData.append("ucFK", aula.ucFK);
    
        // Enviar o FormData para o endpoint
        const response = await axios.post(API_URL + "api/API_ManchasHorarias", formData, {
          headers: {
            "Content-Type": "multipart/form-data", 
          }
        });
    
        if (response.status === 200) {
          console.log("Mancha horária adicionada com sucesso!");
        } else {
          console.error("Erro ao adicionar a mancha horária:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao adicionar a mancha horária:", error);
      }
  };

  //PUTS

  //Função que atualiza os dados quando um bloco é colocado na grelha
  export async function dragBloco(id, horaInicio, dia) {
    try {
      const response = await axios.put(
        API_URL + "api/API_ManchasHorarias/drag-bloco/" + id,
        {
          horaInicio, 
          dia,        
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      console.log('Mancha atualizada com sucesso:', response.data);
    } catch (error) {
      console.error('Erro ao atualizar mancha:', error.response?.data || error.message);
    }
  };
  
