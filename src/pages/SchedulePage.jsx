import React, { useEffect, useState } from "react";
import {
  add,
  startOfWeek,
  format,
  eachDayOfInterval,
  startOfDay,
  addMinutes,
} from "date-fns";
import pt from "date-fns/locale/pt";
import "../css/horario.css";
import { getManchasHorarias, adicionarManchaHoraria, getDocentes } from "../api/api";

const SchedulePage = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [aulas, setAulas] = useState([]);

  const diasDaSemana = eachDayOfInterval({
    start: currentWeekStart,
    end: add(currentWeekStart, { days: 5 }),
  });

  const horas = Array.from({ length: 33 }, (_, i) =>
    addMinutes(startOfDay(new Date()), 480 + 30 * i)
  );

  const blocosPorDefeito = [
    {
      cadeira: "Programação",
      tipo: "TP",
      professor: "Ana",
      sala: "101",
      duracao: 90,
    },
    {
      cadeira: "Matemática",
      tipo: "PL",
      professor: "João",
      sala: "102",
      duracao: 60,
    },
  ];

  const mudarSemana = (direcao) => {
    const novaSemana = add(currentWeekStart, { weeks: direcao });
    setCurrentWeekStart(novaSemana);
  };
  const adicionarAula = () => {
    setAulas([...aulas, novaAula]);
    setNovaAula({ ...novaAula, cadeira: "", professor: "" });

    const blocos = calcularBlocos(novaAula.horaInicio, novaAula.horaFim);

    console.log(novaAula);
    console.log(blocos);
    if(blocos <= 0 || novaAula.professor <= 0|| novaAula.sala === "" || novaAula.cadeira === "" || novaAula.tipo === ""){ 
      alert("A aula não pode ter uma duração negativa ou zero.");
      return;
    }
    
    setFormData({
      tipoAula: novaAula.tipo,
      numSlots: blocos,
      horaInicio: novaAula.horaInicio,
      diaSemana: novaAula.dia,
      docenteFK: 1,
      salaFK: 1,
      ucFK: 1,
    });

    console.log(formData);

    adicionarManchaHoraria(formData);
  };

  const calcularBlocos = (inicio, fim) => {
    const [h1, m1] = inicio.split(":").map(Number);
    const [h2, m2] = fim.split(":").map(Number);
  
    const minutosInicio = h1 * 60 + m1;
    const minutosFim = h2 * 60 + m2;
  
    const duracao = minutosFim - minutosInicio;
    const blocos = duracao / 30;
  
    return blocos;
  };
  

  useEffect(() => {
    const inic = async () => {
      try {
        //vai buscar os docentes
        const d = await getDocentes();
        setDocentes(d);
  
        const mH = await getManchasHorarias();
        setAulas(mH);
  
      } catch (error) {
        console.error("Erro ao obter os dados:", error);
      }
    };
    inic();
    
  }, []); 

  return (
    <div className="horario-container">
      <div className="header">
        <button onClick={() => mudarSemana(-1)}>← Semana anterior</button>
        <h2>
          {`${format(currentWeekStart, "EEEE, dd 'de' MMMM", {
            locale: pt,
          })} - ${format(add(currentWeekStart, { days: 5 }), "EEEE, dd 'de' MMMM", {
            locale: pt,
          })}`}
        </h2>
        <button onClick={() => mudarSemana(1)}>Semana seguinte →</button>
      </div>

      <div className="main-grid">
        <div className="sidebar">
          <h3>Blocos por Defeito</h3>
          {blocosPorDefeito.map((bloco, i) => (
            <div
              key={i}
              className="bloco-default"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("application/json", JSON.stringify(bloco));
              }}
            >
              <strong>{bloco.cadeira}</strong> ({bloco.tipo})<br />
              Prof. {bloco.professor}<br />
              {bloco.sala}<br />
              {bloco.duracao} min
            </div>
          ))}
        </div>

        <div className="grelha">
          <div className="grelha-header">
            <div className="hora"></div>
            {diasDaSemana.map((dia) => (
              <div key={dia} className="dia">
                {format(dia, "EEEE, dd 'de' MMMM", { locale: pt })}
              </div>
            ))}
          </div>
          <div className="grelha-body">
            {horas.map((hora, index) => (
              <div key={index} className="linha">
                <div className="hora">{format(hora, "HH:mm")}</div>
                {diasDaSemana.map((dia) => {
                  const aulasDoDia = aulas.filter(
                    (a) => a.dia === format(dia, "yyyy-MM-dd") && a.horaInicio === format(hora, "HH:mm")
                  );

                  return (
                    <div
                      key={`${dia}-${hora}`}
                      className="slot"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const data = JSON.parse(e.dataTransfer.getData("application/json"));
                        const novaAula = {
                          ...data,
                          dia: format(dia, "yyyy-MM-dd"),
                          horaInicio: format(hora, "HH:mm"),
                          horaFim: format(addMinutes(hora, data.duracao), "HH:mm"),
                        };
                        setAulas((prev) => [...prev, novaAula]);
                      }}
                    >
                      {aulasDoDia.map((aula, i) => {
                  const [hStart, mStart] = aula.horaInicio.split(":").map(Number);
                  const [hEnd, mEnd] = aula.horaFim.split(":").map(Number);
                  const minutosInicio = hStart * 60 + mStart;
                  const minutosFim = hEnd * 60 + mEnd;
                  const altura = (minutosFim - minutosInicio) * (40 / 30);

                  const removerAula = () => {
                    setAulas((prev) =>
                      prev.filter(
                        (a) =>
                          !(
                            a.cadeira === aula.cadeira &&
                            a.professor === aula.professor &&
                            a.dia === aula.dia &&
                            a.horaInicio === aula.horaInicio
                          )
                      )
                    );
                  };

                  return (
                    <div
                      key={`${dia}-${hora}-${i}`}
                      className="aula"
                      style={{ height: `${altura}px`, top: 0, position: "relative" }}
                    >
                      <button
                        onClick={removerAula}
                        style={{
                          position: "absolute",
                          top: "4px",
                          right: "6px",
                          background: "transparent",
                          border: "none",
                          color: "#fff",
                          fontSize: "14px",
                          cursor: "pointer",
                        }}
                        title="Remover aula"
                      >
                        ×
                      </button>
                      <strong>{aula.cadeira}</strong>
                      <em>{aula.tipo}</em>
                      <div>{aula.professor}</div>
                      <div>{aula.sala}</div>
                    </div>
                  );
                })}

                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
