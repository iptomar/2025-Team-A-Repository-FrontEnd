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

