import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from 'react-router-dom';
import * as Api from "../../api/api";

export default function DetalhesCurso() {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Api.getDetalheCurso(id)
      .then((response) => response.json())
      .then((data) => {
        setCurso(data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Erro ao carregar os detalhes do curso.");
        setLoading(false);
        console.error("Erro ao carregar curso:", error);
      });
  }, [id]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="d-flex justify-content-center mt-5">
      <div className="card" style={{ width: '50%' }}>
        <div className="card-body">
          <h2 className="card-title text-center">Detalhe do Curso</h2>
          <hr />
          {curso ? (
            <>
              <div className="text-center mb-4">
                <p><strong>Nome:</strong> {curso.nome}</p>
                <p><strong>Código:</strong> {curso.codCurso}</p>
                <p><strong>Escola:</strong> {curso.escola?.nome}</p>
                <p><strong>Unidades Curriculares:</strong></p>
                <ul style={{ listStylePosition: 'inside', paddingLeft: '0' }}>
                  {curso.listaUcs && curso.listaUcs.length > 0 ? (
                    curso.listaUcs.map((uc, index) => (
                      <li key={index} style={{ textAlign: 'center' }}>
                        {uc.nome} 
                      </li>
                    ))
                  ) : (
                    <p>Não há unidades curriculares associadas.</p>
                  )}
                </ul>
              </div>
            </>
          ) : (
            <p>Curso não encontrado.</p>
          )}

          {/* Botão de Voltar */}
          <div className="d-flex justify-content-center mt-4">
            <button 
              className="btn btn-secondary" 
              onClick={() => navigate('/cursos')} // Volta para a página de cursos
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
