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
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
  
    if (!nome || !email) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }
  
    // Dados a serem enviados no formato esperado pela API
    const dataASubmeter = {
      nome: nome,
      email: email
    };
  
    console.log("Dados a enviar para a API:", dataASubmeter);
  
    setLoading(true);
  
    Api.criarDocente(dataASubmeter)
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
          toast.success("Docente criado com sucesso!");
          navigate('/docentes');
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Ocorreu um erro ao criar o Docente.");
        console.error(error);
      });
  };

  return (
    <CriarPage titulo="Criar Docente">
      <form onSubmit={handleSubmit}>
        <TextInput id="nome" label="Nome do Docente" value={nome} onChange={(e) => setNome(e.target.value)} />
        <TextInput id="email" label="Email do Docente" value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="d-flex justify-content-between mt-4">
          <SubmitButton loading={loading} text="Criar" />
          <ReturnButton text="Voltar" endpoint="/docentes" />
        </div>
      </form>
    </CriarPage>
  );
}
