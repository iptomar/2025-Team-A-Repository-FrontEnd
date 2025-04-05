// src/api/api.js

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


// Função para obter a lista de cursos
export function getCursos() {
    return fetch('https://localhost:7008/api/API_Cursos');
}
