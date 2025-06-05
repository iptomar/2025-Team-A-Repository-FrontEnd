import React, { useEffect, useState } from "react";
import * as Api from "../api/api";
import { Select, MenuItem } from "@mui/material";
import TurmasSelect from "./common/SelectTurma";
import { toast } from "react-toastify";
import customDarkStyles from "./DarkModeFiles/darkmode"; // Importa os estilos personalizados para o modo escuro
import useDarkMode from "./DarkModeFiles/useDarkMode"; // Hook personalizado para verificar o modo escuro

// Componente funcional para a gestão de horários
const GestaoHorarios = ({
  horarioSelecionado, // Horário atualmente selecionado
  setHorarioSelecionado, // Função para atualizar o horário selecionado
  mostrarCriar, // Estado que controla se o formulário de criação de horário está visível
  setMostrarCriar, // Função para atualizar o estado de visibilidade do formulário de criação
}) => {
  const [horarios, setHorarios] = useState([]);

  // Estados para armazenar os valores dos campos do formulário de criação de horário
  const [anoLetivo, setanoLetivo] = useState("");
  const [semestre, setSemestre] = useState("");
  const [turma, setTurma] = useState(null);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [horarioCriado, setHorarioCriado] = useState(false);

  const isDarkMode = useDarkMode(); // Verifica se o modo escuro está ativo

  // Estado para armazenar os valores de busca
  const [buscaAnoLetivo, buscaSetAnoLetivo] = useState("");
  const [buscaSemestre, buscaSetSemestre] = useState("");
  const [buscaTurma, buscaSetTurma] = useState(null);

  // Efeito para buscar as turmas disponíveis ao carregar o componente
  useEffect(() => {
    const buscarHorariosFiltrados = async () => {
      if (buscaAnoLetivo && buscaSemestre && buscaTurma?.value) {
        try {
          const response = await Api.getHorariosFiltrados(buscaAnoLetivo, buscaSemestre, buscaTurma.value);
          const h = await response.json();
          const horariosFormatados = h.map((bloco) => ({
            ...bloco,
            nomeHorario:
              bloco.anoLetivo +
              " | " +
              bloco.semestre +
              "º Semestre | " +
              bloco.turmaCurso +
              " | " +
              bloco.anoCurso +
              " | " +
              bloco.nomeTurma,
          }));
          setHorarios(horariosFormatados);
        } catch (error) {
          console.error("Erro ao buscar horários filtrados:", error);
        }
      } else {
        setHorarios([]); // Limpa se não houver filtros suficientes
      }
    };

    buscarHorariosFiltrados();
  }, [buscaAnoLetivo, buscaSemestre, buscaTurma]);

  // Função para criar um novo horário
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
          <h5 className="card-title mb-0">Gestão de Horários de Turmas</h5>
          {/* Botão para mudar o horário selecionado */}
          {horarioSelecionado && (
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => {
                setHorarioSelecionado(null); // Limpa o horário selecionado
                buscaSetAnoLetivo("");
                buscaSetSemestre("");
                buscaSetTurma(null); // Limpa a turma selecionada
              }}
            >
              Mudar horário
            </button>
          )}
        </div>


        {/* Se nenhum horario estiver selecionado */}
        {!(horarioSelecionado) && (
          <div
            style={{
              display: "flex",
              flexDirection: "column", // empilha verticalmente
              gap: "1rem",
              marginTop: 16,
            }}
          >

            {/* Linha de filtros e seleção de horário */}
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              {/* Ano Letivo */}
              <div style={{ flex: 1 }}>
                <label className="form-label">Ano Letivo</label>
                <Select
                  fullWidth
                  value={buscaAnoLetivo}
                  onChange={(e) => buscaSetAnoLetivo(e.target.value)}
                  style={{ height: "40px" }}
                >
                  <MenuItem value="24/25">24/25</MenuItem>
                  <MenuItem value="25/26">25/26</MenuItem>
                  <MenuItem value="26/27">26/27</MenuItem>
                </Select>
              </div>

              {/* Semestre */}
              <div style={{ flex: 1 }}>
                <label className="form-label">Semestre</label>
                <Select
                  fullWidth
                  value={buscaSemestre}
                  onChange={(e) => buscaSetSemestre(e.target.value)}
                  style={{ height: "40px" }}
                >
                  <MenuItem value="1">1º Semestre</MenuItem>
                  <MenuItem value="2">2º Semestre</MenuItem>
                </Select>
              </div>


              {/* Turma */}
              <div style={{ flex: 2, marginTop: "15px" }}>
                <TurmasSelect
                  id="turma"
                  label="Turma"
                  value={buscaTurma}
                  onChange={buscaSetTurma} // Atualiza o estado com a turma selecionada
                  styles={isDarkMode ? customDarkStyles : {}} // Aplica estilos personalizados
                />
              </div>

              { /* Select com apenas os horários com os parametros anteriormente colocados... */}
              <div style={{ flex: 1 }}>
                <label className="form-label">Datas</label>
                <select
                  className="form-select"
                  value={horarioSelecionado?.id || ""}
                  onChange={(e) => {
                    const id = parseInt(e.target.value);
                    const h = horarios.find((h) => h.id === id);
                    setHorarioSelecionado(h);
                    carregarManchasDoHorario(h.id);
                  }}
                  disabled={!(buscaAnoLetivo && buscaSemestre && buscaTurma?.value)}
                >
                  <option value="">Selecione um horário</option>
                  {/* Mapeia os horários disponíveis para opções no dropdown */}
                  {horarios.map((h) => (
                    <option key={h.id} value={h.id}>
                      {new Date(h.dataInicio).toLocaleDateString()} - {new Date(h.dataFim).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Botão para mostrar o formulário de criação de horário */}
            {!mostrarCriar ? (
              <div className="text-start">
                <button
                  className="btn btn-link p-0"
                  onClick={() => setMostrarCriar(true)}
                >
                  + Criar novo horário
                </button>
              </div>
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
                  styles={customDarkStyles} // Aplica estilos personalizados
                >
                  <MenuItem value="1">1º Semestre</MenuItem>
                  <MenuItem value="2">2º Semestre</MenuItem>
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
                  styles={isDarkMode ? customDarkStyles : {}} // Aplica estilos personalizados
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

          </div>
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
