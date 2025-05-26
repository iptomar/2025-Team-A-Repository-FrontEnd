import React, { useEffect, useState } from "react";
import * as Api from "../api/api";
import { Select, MenuItem } from "@mui/material";
import TurmasSelect from "./common/SelectTurma";
import { toast } from "react-toastify";
import { set } from "date-fns";
// Componente funcional para a gestão de horários
const GestaoHorarios = ({
  horarioSelecionado, // Horário atualmente selecionado
  setHorarioSelecionado, // Função para atualizar o horário selecionado
  mostrarCriar, // Estado que controla se o formulário de criação de horário está visível
  setMostrarCriar, // Função para atualizar o estado de visibilidade do formulário de criação
}) => {
  const [horarios, setHorarios] = useState([]);
  const [anoLetivo, setanoLetivo] = useState("");
  const [semestre, setSemestre] = useState("");
  const [turma, setTurma] = useState(null);

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");


  const [horarioCriado, setHorarioCriado] = useState(false);

  // Carregar lista de horários

  useEffect(() => {
    const inic = async () => {
      try {
        const response = await Api.getHorarios();
        const h = await response.json();
        const horariosFormatados = h.map((bloco) => ({
          ...bloco,
          nomeHorario:
            bloco.anoLetivo +
            " " +
            bloco.turmaCurso +
            " " +
            bloco.semestre +
            " " +
            bloco.anoCurso +
            " " +
            bloco.nomeTurma,
        }));

        setHorarios(horariosFormatados);
      } catch (error) {
        console.error("Erro ao obter os dados:", error);
      }
    };
    inic();
  }, [horarioCriado]); // Recarrega os horários quando um novo horário é criado

  const criarHorario = async () => {
    try {
      const dataASubmeter = {
        anoLetivo: anoLetivo,
        semestre: semestre,
        turmaFK: turma.value,
        dataInicio: dataInicio,
        dataFim: dataFim,
      };       
      if (new Date(dataFim) <= new Date(dataInicio)) {
        toast.error("A data de fim deve ser posterior à data de início.");
        return;
      }
      const response = await Api.criarHorario(dataASubmeter);
      const data = await response.json();
      if (data.erro) {
        toast.error("Erro ao criar horário: " + data.erro);
      } else {
        console.log("else");
        toast.success("Horário criado com sucesso!");
        setMostrarCriar(false); // Esconde o formulário de criação
        setHorarioCriado(true); // Atualiza o estado para indicar que o horário foi criado
        setanoLetivo(""); // Limpa o campo de ano letivo
        setSemestre(""); // Limpa o campo de semestre
        setTurma(null); // Limpa o campo de turma
        setDataInicio(""); // Limpa o campo de data de início
        setDataFim(""); // Limpa o campo de data de fim
      }
    } catch (err) {
      console.log("catch");
      console.error("Erro ao criar horário:", err);
    }
  };

  const carregarManchasDoHorario = (id) => {
    console.log("Carregar manchas do horário:", id);
    // Chamada para ir buscar as manchas desse horário específico
    // setAulas(...) etc.
  };
  return (
    <div className="card shadow-sm mb-4" style={{ margin: "1rem" }}>
      <div className="card-body">
        {/* Cabeçalho do componente */}
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Gestão de Horários</h5>
          {/* Botão para mudar o horário selecionado */}
          {horarioSelecionado && (
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setHorarioSelecionado(null)} // Limpa o horário selecionado
            >
              Mudar horário
            </button>
          )}
        </div>

        {/* Se nenhum horário estiver selecionado */}
        {!horarioSelecionado && (
          <>
            <div className="mt-3 mb-3">
              <label className="form-label">Selecionar horário existente</label>
              {/* Dropdown para selecionar um horário existente */}
              <select
                className="form-select"
                value={horarioSelecionado?.id || ""} // Define o valor do dropdown com base no horário selecionado
                onChange={(e) => {
                  const id = parseInt(e.target.value); // Obtém o ID do horário selecionado
                  const h = horarios.find((h) => h.id === id); // Encontra o horário correspondente
                  setHorarioSelecionado(h); // Atualiza o horário selecionado
                  carregarManchasDoHorario(h.id); // Carrega as manchas do horário selecionado
                }}
              >
                <option value="">Selecione um horário</option>
                {/* Mapeia os horários disponíveis para opções no dropdown */}
                {horarios.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.nomeHorario}
                  </option>
                ))}
              </select>
            </div>

            {/* Botão para mostrar o formulário de criação de horário */}
            {!mostrarCriar ? (
              <button
                className="btn btn-link p-0"
                onClick={() => setMostrarCriar(true)} // Mostra o formulário de criação
              >
                + Criar novo horário
              </button>
            ) : (
              // Formulário para criar um novo horário
              <form
                onSubmit={(e) => {
                  e.preventDefault(); // Evita o comportamento padrão do formulário
                  criarHorario(); // Chama a função para criar o horário
                }}
              >
                <h3>Criar Horário</h3>

                {/* Campo para selecionar o ano letivo */}
                <label className="form-label">Selecione o Ano Letivo</label>
                <br></br>
                <Select
                  style={{
                    width: "100%",
                    height: "40px",
                    marginBottom: "15px",
                  }}
                  labelId="anoLetivo-label"
                  id="anoLetivo"
                  value={anoLetivo}
                  onChange={(e) => setanoLetivo(e.target.value)}
                >
                  <MenuItem value="24/25">24/25</MenuItem>
                  <MenuItem value="25/26">25/26</MenuItem>
                  <MenuItem value="26/27">26/27</MenuItem>
                </Select>

                {/* Campo para selecionar o semestre */}
                <label className="form-label">Selecione o Semestre</label>
                <br></br>
                <Select
                  style={{
                    width: "100%",
                    height: "40px",
                    marginBottom: "15px",
                  }}
                  labelId="semestre-label"
                  id="semestre"
                  value={semestre}
                  onChange={(e) => setSemestre(e.target.value)}
                >
                  <MenuItem value="1ºSemestre">1º Semestre</MenuItem>
                  <MenuItem value="2ºSemestre">2º Semestre</MenuItem>
                </Select>
                {/* Campo para Data de Início */}
                <label className="form-label">Data de Início</label>
                <input
                  type="date"
                  className="form-control mb-3"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  required
                />

                {/* Campo para Data de Fim */}
                <label className="form-label">Data de Fim</label>
                <input
                  type="date"
                  className="form-control mb-3"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  required
                />
                {/* Campo para selecionar a turma */}
                <TurmasSelect
                  id="turma"
                  label="Turma"
                  value={turma}
                  onChange={setTurma} // Atualiza o estado com a turma selecionada
                />
                <div className="d-flex gap-2">
                  {/* Botão para submeter o formulário */}
                  <button type="submit" className="btn btn-success">
                    Criar
                  </button>
                  {/* Botão para cancelar a criação do horário */}
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setMostrarCriar(false); // Esconde o formulário de criação
                      // Limpa os campos do formulário
                      setanoLetivo(""); // Limpa o campo de ano letivo
                      setSemestre(""); // Limpa o campo de semestre
                      setTurma(null); // Limpa o campo de turma
                      setDataInicio("");
                      setDataFim("");
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {/* Exibe o nome do horário selecionado */}
        {horarioSelecionado && (
          <p className="text-muted mt-2">
            A visualizar: <strong>{horarioSelecionado.nomeHorario}</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default GestaoHorarios;
