import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import * as Api from "../../api/api";
import { useNavigate, useParams } from 'react-router-dom';
import TextInput from "../../components/common/TextInput";
import SubmitButton from "../../components/common/SubmitButton";
import EditarPage from "./EditarPage";
import ReturnButton from "../../components/common/ReturnButton";

export default function EditarUtilizador() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
 

  const navigate = useNavigate();
  const { id } = useParams();

  // Carregar dados do utilizador
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar dados do utilizador
        const resUtilizador = await Api.getDetalhesUtilizador(id);
        const UtilizadorData = await resUtilizador.json();

        setNome(UtilizadorData.nome);
        setEmail(UtilizadorData.email);

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

    if (!nome || !email) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    const dataASubmeter = {
      id:id,
      nome: nome,
      email: email
    };

    setLoading(true);

    Api.updateUtilizador(id, dataASubmeter)
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
          toast.success("Utilizador editado com sucesso!");
          navigate('/utilizadores');
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Ocorreu um erro ao editar o utilizador.");
        console.error(error);
      });
  };

  if (!nome) {
    return <div>Carregando...</div>;
  }

  return (
    <EditarPage titulo="Editar Utilizador">
      <form onSubmit={handleSubmit}>
        <TextInput
          id="nome"
          label="Nome do Utilizador"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <TextInput
          id="email"
          label="Email do Utilizador"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="d-flex justify-content-between mt-4">
          <SubmitButton loading={loading} text="Editar Utilizador" />
          <ReturnButton text="Voltar" endpoint="/utilizadores" />
        </div>
      </form>
    </EditarPage>
  );
}
