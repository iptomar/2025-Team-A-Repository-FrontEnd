////////////////////////////////////////////////////////////////////////
// catarina 

// Função para obter a lista de unidades curriculares
export function getUCs() {
    return fetch('https://localhost:7008/api/API_UnidadesCurriculares');
}

// Função para apagar uma UC
export function apagaUC(id) {
    return fetch(`https://localhost:7008/api/API_UnidadesCurriculares/${id}`, {
        method: "DELETE",        
    })
}

// Função para criar uma nova uc 
export function criarUc(d) {
    return fetch('https://localhost:7008/api/API_UnidadesCurriculares', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(d)
    });
}

// Função para ver detalhes de uma UC
export const getDetalheUC = (id) => {
    return fetch(`https://localhost:7008/api/API_UnidadesCurriculares/${id}`); // Rota da API para obter uma UC pelo id
}

// Atualizar uma Unidade Curricular 
export const updateUC = (id, uc) => {
    return fetch(`https://localhost:7008/api/API_UnidadesCurriculares/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uc)        
    });
}
  
// Função para obter a lista de cursos
export function getCursos() {
    return fetch('https://localhost:7008/api/API_Cursos');
}

// catarina 
////////////////////////////////////////////////////////////////////////

const API_URL = 'http://localhost:7008/'

// Função para fazer login
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

// Função para fazer o registo
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


////// TURMAS //////

// Função para obter a lista de turmas
export function getTurmas() {
    return fetch(`https://localhost:7008/api/API_Turmas`);
}

// Função para apagar uma turma
export function apagaTurma(id) {
    return fetch(`https://localhost:7008/api/API_Turmas/${id}`, {
        method: "DELETE",        
    })
}

/// Função para criar uma nova turma
export function criarTurma(d) {
    return fetch(`https://localhost:7008/api/API_Turmas`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(d)
    });
}

/// Função para ver detalhes de uma turma
export const getDetalheTurma = (id) => {
    return fetch(`https://localhost:7008/api/API_Turmas/${id}`);
}

// Função para obter a lista de cursos
export const updateTurma = (id, tm) => {
    return fetch(`https://localhost:7008/api/API_Turmas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tm)        
    });
}
