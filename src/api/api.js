import axios from "axios";
const API_URL = "http://localhost:5251/";

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
// Salas

export function getSalas() {
  return fetch(`${API_URL}api/API_Salas`);
}

export function apagaSala(id) {
  return fetch(`${API_URL}api/API_Salas/${id}`, { method: "DELETE" });
}

export function criarSala(sala) {
  return fetch(`${API_URL}api/API_Salas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sala)
  });
}

export function updateSala(id, sala) {
  return fetch(`${API_URL}api/API_Salas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sala)
  });
}

export function getDetalheSala(id) {
  return fetch(`${API_URL}api/API_Salas/${id}`);
}

// ////////////////////////////////////////////////////////////////////////////
// Cursos

// Obter todos os cursos
export function getCursos() {
  return fetch(`${API_URL}api/API_Cursos`);
}

// Obter detalhes de um curso
export const getDetalheCurso = (id) => {
  return fetch(`${API_URL}api/API_Cursos/${id}`);
};

// Apagar um curso
export function apagaCurso(id) {
  return fetch(`${API_URL}api/API_Cursos/${id}`, {
    method: "DELETE",
  });
}

// Criar um novo curso
export function criarCurso(d) {
  return fetch(`${API_URL}api/API_Cursos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(d),
  });
}

// Atualizar um Curso
export const updateCurso = (id, uc) => {
  return fetch(`${API_URL}api/API_Cursos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(uc),
  });
};

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
    return fetch(`${API_URL}api/API_Docentes`);
  } catch (error) {
    console.error("Erro ao ir buscar os docentes:", error);
  }
};
// ////////////////////////////////////////////////////////////////////////////
// SALAS

export const getSalas = async () => {
  try {
    return fetch(`${API_URL}api/API_Salas`);
  } catch (error) {
    console.error("Erro ao ir buscar as salas:", error);
  }
}
// ////////////////////////////////////////////////////////////////////////////
// Manchas Horárias

// Obter todas as manchas horárias
export const getManchasHorarias = async () => {
  try {
    return fetch(`${API_URL}api/API_ManchasHorarias`);
  } catch (error) {
    console.error("Erro ao ir buscar as machas horarias:", error);
  }
};
//Eliminar uma Mancha Horária
export const deleteManchaHoraria = async (id) => {
  return fetch(`${API_URL}api/API_ManchasHorarias/${id}`, {
    method: "DELETE",
  });
};
// Criar mancha horária
export const criarManchaHoraria = async (mh) => {
  try {
    const formData = new FormData();
    formData.append("tipoAula", mh.tipoAula);
    formData.append("numSlots", mh.numSlots);
    formData.append("docenteFK", mh.docenteFK);
    formData.append("salaFK", mh.salaFK);
    formData.append("ucFK", mh.ucFK);

    const response = await axios.post(`${API_URL}api/API_ManchasHorarias`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
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

// Obter detalhes de uma mancha horaria
export const getDetalhesManchaHoraria= (id) => {
  return fetch(`${API_URL}api/API_ManchasHorarias/${id}`);
};



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
