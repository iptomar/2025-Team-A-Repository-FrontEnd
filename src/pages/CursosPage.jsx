import { useEffect, useState } from "react";
import ListaCursos from "../components/ListaCursos/lista";
import { getCursos } from "../api/api";

export default function CursosPage() {
  const [cursos, setCursos] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    getCursos()
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao obter Cursos: " + res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Cursos recebidos:", data);
        setCursos(data);
      })
      .catch((err) => {
        console.error(err);
        setErro(err.message);
      });
  }, []);

  if (erro) return <p>Erro: {erro}</p>;

  if (cursos === null) {
    return <p>A carregar Cursos...</p>;
  }

  return (
    <>
      <h2 className="text-center mt-5">Cursos</h2>
      <div className="d-flex justify-content-center mt-4">
        <a href="#/criar-curso" className="btn btn-primary">
          Criar curso
        </a>
      </div>

      <div className="pt-4">
        <ListaCursos
          cursos={cursos}
          setCursos={setCursos} // Passar a função aqui
        />
      </div>
    </>
  );
}
