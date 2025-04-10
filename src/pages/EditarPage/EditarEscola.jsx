import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import * as Api from "../../api/api";
import { useNavigate, useParams } from 'react-router-dom';
import TextInput from "../../components/common/TextInput";
import SubmitButton from "../../components/common/SubmitButton";
import EditarPage from "./EditarPage";
import ReturnButton from "../../components/common/ReturnButton";

export default function EditarEscola() {
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);
  const [escola, setEscola] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  // Carregar dados da turma e cursos disponíveis
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar dados da turma
        const resEscola = await Api.getDetalheEscola(id);
        const escolaData = await resEscola.json();

        setEscola(escolaData);
        setNome(escolaData.nome);

      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        toast.error("Erro ao carregar os dados.");
      }
    };

    fetchData();
  }, [id]);

  // Função de envio do formulário
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!nome) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    const dataASubmeter = {
      id:id,
      nome: nome
    };

    setLoading(true);

    Api.updateEscola(id, dataASubmeter)
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.text().then((text) => {
            return text ? JSON.parse(text) : {};
          });
      })
      .then((data) => {
        setLoading(false);
        if (data.erro) {
          toast.error(data.erro);
        } else {
          toast.success("Escola editada com sucesso!");
          navigate('/escolas');
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Ocorreu um erro ao editar a escola.");
        console.error(error);
      });
  };

  if (!escola) {
    return <div>Carregando...</div>;
  }

  return (
    <EditarPage titulo="Editar Escola">
      <form onSubmit={handleSubmit}>
        <TextInput
          id="nome"
          label="Nome da Escola"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <div className="d-flex justify-content-between mt-4">
          <SubmitButton loading={loading} text="Editar Escola" />
          <ReturnButton text="Voltar" endpoint="/escolas" />
        </div>
      </form>
    </EditarPage>
  );
}
