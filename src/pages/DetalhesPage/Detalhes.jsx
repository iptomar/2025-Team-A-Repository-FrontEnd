import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams } from 'react-router-dom';
import ReturnButton from "../../components/common/ReturnButton";

export default function Detalhes({ entidadeNome, campos, fetchFn, voltarPath }) {
  const { id } = useParams();
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFn(id)
      .then((response) => response.json())
      .then((data) => {
        setDados(data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error(`Erro ao carregar os detalhes de ${entidadeNome}.`);
        setLoading(false);
        console.error("Erro ao carregar:", error);
      });
  }, [id, fetchFn, entidadeNome]);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="d-flex justify-content-center mt-5">
      <div className="card" style={{ width: '50%' }}>
        <div className="card-body">
          <h2 className="card-title text-center">Detalhe da {entidadeNome}</h2>
          <hr />
          {dados ? (
            <div className="text-center mb-4">
              {campos.map(({ label, key }) => (
                <p key={key}>
                  <strong>{label}:</strong> {key.includes('.') 
                    ? key.split('.').reduce((acc, curr) => acc?.[curr], dados) 
                    : dados[key] ?? '—'}
                </p>
              ))}
            </div>
          ) : (
            <p>{entidadeNome} não encontrada.</p>
          )}

          <div className="d-flex justify-content-center mt-4">
            <div className="d-flex justify-content-center mt-4">
              <ReturnButton text="Voltar" endpoint={voltarPath} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
