import axios from "axios";
const API_URL = "https://localhost:7008/";

// ////////////////////////////////////////////////////////////////////////////
// UCs

// Obter todas as UCs
export function getUCs() {
  return fetch(`${API_URL}api/API_UnidadesCurriculares`);
}

// Apagar uma UC
export function apagaUC(id) {
  return fetch(`${API_URL}api/API_UnidadesCurriculares/${id}`, {
    method: "DELETE",
  });
}

// Criar uma nova UC
export function criarUc(d) {
  return fetch(`${API_URL}api/API_UnidadesCurriculares`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(d),
  });
}

// Obter detalhes de uma UC
export const getDetalheUC = (id) => {
  return fetch(`${API_URL}api/API_UnidadesCurriculares/${id}`);
};

// Atualizar uma UC
export const updateUC = (id, uc) => {
  return fetch(`${API_URL}api/API_UnidadesCurriculares/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(uc),
  });
};

// ////////////////////////////////////////////////////////////////////////////
// Cursos

// Obter todos os cursos
export function getCursos() {
  return fetch(`${API_URL}api/API_Cursos`);
}

// ////////////////////////////////////////////////////////////////////////////
// Turmas

// Obter todas as turmas
export function getTurmas() {
  return fetch(`${API_URL}api/API_Turmas`);
}

// Apagar uma turma
export function apagaTurma(id) {
  return fetch(`${API_URL}api/API_Turmas/${id}`, {
    method: "DELETE",
  });
}

// Criar nova turma
export function criarTurma(d) {
  return fetch(`${API_URL}api/API_Turmas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(d),
  });
}

// Obter detalhes de uma turma
export const getDetalheTurma = (id) => {
  return fetch(`${API_URL}api/API_Turmas/${id}`);
};

// Atualizar turma
export const updateTurma = (id, tm) => {
  return fetch(`${API_URL}api/API_Turmas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tm),
  });
};

// ////////////////////////////////////////////////////////////////////////////
// Escolas

// Obter todas as escolas
export function getEscola() {
  return fetch(`${API_URL}api/API_Escolas`);
}

// Apagar uma escola
export function apagaEscola(id) {
  return fetch(`${API_URL}api/API_Escolas/${id}`, {
    method: "DELETE",
  });
}

// Criar nova escola
export function criarEscola(d) {
  return fetch(`${API_URL}api/API_Escolas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(d),
  });
}

// Obter detalhes de uma escola
export const getDetalheEscola = (id) => {
  return fetch(`${API_URL}api/API_Escolas/${id}`);
};

// Atualizar escola
export const updateEscola = (id, esc) => {
  return fetch(`${API_URL}api/API_Escolas/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(esc),
  });
};

// ////////////////////////////////////////////////////////////////////////////
// Docentes

export const getDocentes = async () => {
  try {
    const response = await axios.get(`${API_URL}api/API_Docentes`);
    console.log("Dados recebidos:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao ir buscar os docentes:", error);
  }
};

// ////////////////////////////////////////////////////////////////////////////
// Manchas Horárias

export const getManchasHorarias = async () => {
  try {
    const response = await axios.get(`${API_URL}api/API_ManchasHorarias`);
    console.log("Dados recebidos:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao ir buscar as machas horarias:", error);
  }
};

// Criar mancha horária
export const adicionarManchaHoraria = async (aula) => {
  try {
    const formData = new FormData();
    formData.append("tipoAula", aula.tipoAula);
    formData.append("numSlots", aula.numSlots);
    formData.append("horaInicio", aula.horaInicio);
    formData.append("diaSemana", aula.diaSemana);
    formData.append("docenteFK", aula.docenteFK);
    formData.append("salaFK", aula.salaFK);
    formData.append("ucFK", aula.ucFK);

    const response = await axios.post(`${API_URL}api/API_ManchasHorarias`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
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

// Atualizar posição de uma mancha horária
export async function dragBloco(id, horaInicio, dia) {
  try {
    const response = await axios.put(
      `${API_URL}api/API_ManchasHorarias/drag-bloco/${id}`,
      {
        horaInicio,
        dia,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Mancha atualizada com sucesso:", response.data);
  } catch (error) {
    console.error("Erro ao atualizar mancha:", error.response?.data || error.message);
  }
}

// ////////////////////////////////////////////////////////////////////////////
// Autenticação

// Login
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

// Registo
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
