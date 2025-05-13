import { useEffect, useState } from "react";
import ListaTurmas from "../components/Listas/ListaTurmas";
import { getManchasHorarias } from "../api/api";
import ListaManchasHorarias from "../components/Listas/ListaManchasHorarias";
// import { set } from "date-fns";

const ManchasHorariasPage = () => {
  const [manchasHorarias, setManchasHorarias] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const inic = async () => {
      try {
        const response = await getManchasHorarias();
        const mH = await response.json();
        console.log(mH);
        // const blocosFormatados = mH.map((bloco) => ({
        //   id: bloco.id,
        //   cadeira: bloco.uc.nome,
        //   tipo: bloco.tipoDeAula,
        //   horaInicio: bloco.horaInicio,
        //   dia: bloco.dia,
        //   professor: bloco.docente.nome,
        //   sala: bloco.sala.nome,
        //   numSlots: bloco.numSlots,
        // }));
        const blocosFormatados = mH.map((bloco) => {
          const horariosFormatados = bloco.listaHorarios.map((horario) => ({
            id: horario.id,
            nome:
              horario.anoLetivo +
              " " +
              horario.turma.curso.nome +
              " " +
              horario.semestre +
              " " +
              (horario.turma.anoCurso || "") + // previne null
              " " +
              horario.turma.nome,
          }));

          const horariosNomes = horariosFormatados.map((h)=>
            h.nome
          );
          return {
            id: bloco.id,
            cadeira: bloco.uc.nome,
            tipo: bloco.tipoDeAula,
            horaInicio: bloco.horaInicio,
            dia: bloco.dia,
            professor: bloco.docente.nome,
            sala: bloco.sala.nome,
            numSlots: bloco.numSlots,
            horarios: horariosFormatados,
            horariosNomes: horariosNomes.join('\n')
          };
        });
        setManchasHorarias(blocosFormatados);
      } catch (error) {
        console.error("Erro ao obter os dados:", error);
      }
    };
    inic();
  }, []);
  if (erro) return <p>Erro: {erro}</p>;

  if (manchasHorarias === null) {
    return <p>A carregar as Manchas Horárias...</p>;
  }

  return (
    <>
      <h2 className="text-center mt-5">Manchas Horárias</h2>
      <div className="d-flex justify-content-center mt-4">
        <a href="#/criar-manchahoraria" className="btn btn-primary">
          Criar Mancha Horária
        </a>
      </div>

      <div className="pt-4">
        {console.log(manchasHorarias)}
        <ListaManchasHorarias
          manchasHorarias={manchasHorarias}
          // setManchasHorarias={setManchasHorarias}
        />
      </div>
    </>
  );
};

export default ManchasHorariasPage;
