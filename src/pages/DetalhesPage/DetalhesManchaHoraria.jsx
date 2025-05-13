// import Detalhes from "./Detalhes";
// import * as Api from "../../api/api";

// export default function DetalhesManchaHoraria() {
//   return (
//     <Detalhes
//       entidadeNome="da Mancha Horaria"
//       campos={[
//         { label: "Unidade Curricular", key: "uc.nome" },
//         { label: "Docente", key: "docente.nome" },
//         { label: "Tipo de Aula", key: "tipoDeAula" },
//         { label: "Sala", key: "sala.nome" },

//         { label: "Número de Slots", key: "numSlots" },
//       ]}
//       fetchFn={Api.getDetalhesManchaHoraria}
//       voltarPath="/manchas_horarias"
//     />
//   );
// }
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import ReturnButton from "../../components/common/ReturnButton";
import * as Api from "../../api/api";

export default function DetalhesManchaHoraria() {
  const { id } = useParams();
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Api.getDetalhesManchaHoraria(id)
      .then((response) => response.json())
      .then((data) => {
        // Processa os horários
        const horarios = data.listaHorarios
          ? data.listaHorarios
              .map((h) => `${h.anoLetivo} ${h.turma.curso.nome} ${h.semestre} ${h.turma.anoCurso || ""} ${h.turma.nome}`)
              .join(' \n ')
          : "Sem horários";

        // Adiciona os horários formatados aos dados
        const dadosComHorarios = {
          ...data,
          horarios, // Agora temos um campo 'horarios' que contém os horários formatados
        };

        setDados(dadosComHorarios);
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Erro ao carregar os detalhes da Mancha Horária.");
        setLoading(false);
        console.error("Erro ao carregar:", error);
      });
  }, [id]);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="d-flex justify-content-center mt-5">
      <div className="card" style={{ width: '50%' }}>
        <div className="card-body">
          <h2 className="card-title text-center">Detalhes da Mancha Horária</h2>
          <hr />
          {dados ? (
            <div className="text-center mb-4">
              <p><strong>Unidade Curricular:</strong> {dados.uc?.nome ?? "—"}</p>
              <p><strong>Docente:</strong> {dados.docente?.nome ?? "—"}</p>
              <p><strong>Tipo de Aula:</strong> {dados.tipoDeAula ?? "—"}</p>
              <p><strong>Sala:</strong> {dados.sala?.nome ?? "—"}</p>
              <p><strong>Horário(s):</strong><pre>
  {dados.horarios}
</pre></p> 
              <p><strong>Número de Slots:</strong> {dados.numSlots ?? "—"}</p>
            </div>
          ) : (
            <p>Mancha Horária não encontrada.</p>
          )}

          <div className="d-flex justify-content-center mt-4">
            <ReturnButton text="Voltar" endpoint="/manchas_horarias" />
          </div>
        </div>
      </div>
    </div>
  );
}
