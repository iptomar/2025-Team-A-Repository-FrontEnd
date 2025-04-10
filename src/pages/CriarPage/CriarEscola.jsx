import React, { useState} from "react";
import { toast } from "react-toastify";
import * as Api from "../../api/api";
import { useNavigate } from 'react-router-dom';
import TextInput from "../../components/common/TextInput";
import SubmitButton from "../../components/common/SubmitButton";
import CriarPage from "./CriarPage";
import ReturnButton from "../../components/common/ReturnButton";

export default function CriarEscola() {
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
  
    if (!nome) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }
  
    // Dados a serem enviados no formato esperado pela API
    const dataASubmeter = {
      nome: nome,
    };
  
    console.log("Dados a enviar para a API:", dataASubmeter);
  
    setLoading(true);
  
    Api.criarEscola(dataASubmeter)
      .then((response) => {
        console.log('Resposta da API:', response);
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
        return response.json();
      })
      .then((data) => {
        setLoading(false);
        if (data.erro) {
          toast.error(data.erro);
        } else {
          toast.success("Escola criada com sucesso!");
          navigate('/escolas');
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Ocorreu um erro ao criar a escola.");
        console.error(error);
      });
  };

  return (
    <CriarPage titulo="Criar Escola">
      <form onSubmit={handleSubmit}>
        <TextInput id="nome" label="Nome da Escola" value={nome} onChange={(e) => setNome(e.target.value)} />
        <div className="d-flex justify-content-between mt-4">
          <SubmitButton loading={loading} text="Criar" />
          <ReturnButton text="Voltar" endpoint="/escolas" />
        </div>
      </form>
    </CriarPage>
  );
}
