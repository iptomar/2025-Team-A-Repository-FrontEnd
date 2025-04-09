import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import * as Api from "../api/api";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

export default function DetalheUC() {
  const { id } = useParams();
  const [uc, setUc] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // Hook de navegação

  useEffect(() => {
    Api.getDetalheUC(id)
      .then((response) => response.json())
      .then((data) => {
        setUc(data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Erro ao carregar os detalhes da UC.");
        setLoading(false);
        console.error("Erro ao carregar UC:", error);
      });
  }, [id]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="d-flex justify-content-center mt-5">
      <div className="card" style={{ width: '50%' }}>
        <div className="card-body">
          <h2 className="card-title text-center">Detalhe da Unidade Curricular</h2>
          <hr />
          {uc ? (
            <>
              <div className="text-center mb-4">
                <p><strong>Nome:</strong> {uc.nome}</p>
                <p><strong>Plano:</strong> {uc.plano}</p>
                <p><strong>Semestre:</strong> {uc.semestre}</p>
                <p><strong>Ano:</strong> {uc.ano}</p>

                <p><strong>Curso(s) Associado(s):</strong></p>
                <ul style={{ listStylePosition: 'inside', paddingLeft: '0' }}>
                  {uc.cursos && uc.cursos.length > 0 ? (
                    uc.cursos.map((curso, index) => (
                      <li key={index} style={{ textAlign: 'center' }}>{curso}</li>
                    ))
                  ) : (
                    <p>Não há cursos associados.</p>
                  )}
                </ul>
              </div>
            </>
          ) : (
            <p>Unidade Curricular não encontrada.</p>
          )}

          {/* Botão de Voltar */}
          <div className="d-flex justify-content-center mt-4">
            <button 
              className="btn btn-secondary" 
              onClick={() => navigate('/unidades_curriculares')} // Volta para a página de ucs
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
