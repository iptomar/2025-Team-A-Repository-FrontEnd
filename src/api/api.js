import axios from "axios";
import { ModalFooter } from "react-bootstrap";
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
    body: JSON.stringify(sala),
  });
}

export function updateSala(id, sala) {
  return fetch(`${API_URL}api/API_Salas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sala),
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

// Apagar um docente
export function eliminaDocente(id) {
  return fetch(`${API_URL}api/API_Docentes/${id}`, {
    method: "DELETE",
  });
}

// Criar novo docente
export function criarDocente(d) {
  return fetch(`${API_URL}api/API_Docentes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(d),
  });
}

// Obter detalhes de um docente
export const getDetalhesDocente = (id) => {
  return fetch(`${API_URL}api/API_Docentes/${id}`);
};

// Atualizar um docente
export const updateDocente = (id, esc) => {
  return fetch(`${API_URL}api/API_Docentes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(esc),
  });
};
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

// Obter detalhes de uma mancha horaria
export const getDetalhesManchaHoraria = (id) => {
  return fetch(`${API_URL}api/API_ManchasHorarias/${id}`);
};

// Obter as manchas horárias por horário
export const getManchasPorHorario = async (id) => {
  try {
    return fetch(`${API_URL}api/API_ManchasHorarias/manchas-por-horario/${id}`);
  } catch (error) {
    console.error("Erro ao ir buscar as machas horarias:", error);
  }
};

// Obter as manchas horárias por sala, ano letivo e semestre
export const getManchasHorariasPorSala = async (
  idSala,
  anoLetivo,
  semestre
) => {
  try {
    return fetch(
      `${API_URL}api/API_ManchasHorarias/Sala/${idSala}?anoLetivo=${encodeURIComponent(
        anoLetivo
      )}&semestre=${semestre}`
    );
  } catch (error) {
    console.error("Erro ao buscar manchas horárias:", error);
    throw error;
  }
};

// Obter as manchas horárias por docente, ano letivo e semestre
export const getManchasHorariasPorDocente = async (
  idDocente,
  anoLetivo,
  semestre
) => {
  try {
    return fetch(
      `${API_URL}api/API_ManchasHorarias/Docente/${idDocente}?anoLetivo=${encodeURIComponent(
        anoLetivo
      )}&semestre=${semestre}`
    );
  } catch (error) {
    console.error("Erro ao buscar manchas horárias:", error);
    throw error;
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
    const response = await axios.post(
      `${API_URL}api/API_ManchasHorarias`,
      {
        tipoDeAula: mh.tipoAula,
        numSlots: mh.numSlots,
        docenteFK: mh.docenteFK,
        salaFK: mh.salaFK,
        ucFK: mh.ucFK,

        horariosIds: mh.horariosList,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Erro ao adicionar a mancha horária:", error);
  }
};

// Atualizar posição de uma mancha horária
export async function dragBloco(id, horaInicio, dia, anoLetivo, semestre) {
  try {
    const response = await axios.put(
      `${API_URL}api/API_ManchasHorarias/drag-bloco/${id}?anoLetivo=${anoLetivo}&semestre=${semestre}`,
      { horaInicio, dia },
      { headers: { "Content-Type": "application/json" } }
    );

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data || "Erro ao atualizar a mancha horária.";
    throw new Error(errorMessage);
  }
}

//editar a mancha horária
export async function updateManchaHoraria(id, dataASubmeter) {
  return fetch(`${API_URL}api/API_ManchasHorarias/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dataASubmeter),
  });
}

// ////////////////////////////////////////////////////////////////////////////

// Utilizadores

export const getUtilizadores = async () => {
  try {
    return fetch(`${API_URL}api/API_Utilizadores`);
  } catch (error) {
    console.error("Erro ao ir buscar os utilizadores:", error);
  }
};

// Apagar um utilizador
export function eliminaUtilizador(id) {
  return fetch(`${API_URL}api/API_Utilizadores/${id}`, {
    method: "DELETE",
  });
}

// Obter detalhes de um utilizador
export const getDetalhesUtilizador = (id) => {
  return fetch(`${API_URL}api/API_Utilizadores/${id}`);
};

// Atualizar um utilizador
export const updateUtilizador = (id, esc) => {
  return fetch(`${API_URL}api/API_Utilizadores/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(esc),
  });
};

// Horarios

// Obter todos os horarios
export function getHorarios() {
  return fetch(`${API_URL}api/API_Horarios`);
}

// Obter um horario por ID
export const getHorarioById = (id) => {
  return fetch(`${API_URL}api/API_Horarios/${id}`);
};

// Criar um novo horario
export function criarHorario(d) {
  return fetch(`${API_URL}api/API_Horarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(d),
  });
}

// Bloquear um horario
export async function bloquearHorario(id) {
  const response = await fetch(
    `${API_URL}api/API_Horarios/Bloquear/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Bloqueado: true }),
    }
  );
  if (!response.ok) {
    throw new Error("Erro ao bloquear o horário");
  }
  return response.json();
}

// Desbloquear um horario
export async function desbloquearHorario(id) {
  const response = await fetch(
    `${API_URL}api/API_Horarios/Desbloquear/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Bloqueado: false }),
    }
  );
  if (!response.ok) {
    throw new Error("Erro ao desbloquear o horário");
  }
  return response.json();
}

// Buscar horários filtrados por ano letivo, semestre e turma
export const getHorariosFiltrados = (anoLetivo, semestre, turmaFK) => {
  return fetch(
    `${API_URL}api/API_Horarios/horarios?anoLetivo=${anoLetivo}&semestre=${semestre}&turmaFK=${turmaFK}`
  );
};


// ////////////////////////////////////////////////////////////////////////////
// Autenticação

// Login
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}api/API_Auth/login`, {
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
    //jwt token fica aqui
    //podes manipular como quiseres

    // Guarda o token
    localStorage.setItem("token", data.token);
    localStorage.setItem("tokenType", data.tokenType || "Bearer");

    return data;
  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
};

// Registo
export const register = async (nome, email, escolaFK, cursoFK, password) => {
  try {
    const response = await fetch(`${API_URL}api/API_Auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome, email, escolaFK, cursoFK, password }),
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

// endpoint para obter os dados do utilizador logado
export const getMe = async () => {
  try {
    const token = localStorage.getItem("token");
    const tokenType = localStorage.getItem("tokenType") || "Bearer";

    const response = await fetch(`${API_URL}api/API_Auth/me`, {
      headers: {
        Authorization: `${tokenType} ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao obter dados do utilizador");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro na função getMe:", error);
    throw error;
  }
};
