import CriarUCForm from "../components/CriarUCForm/CriarUCForm"; // Importa o componente do formulário

export default function CriarUC() {  
  return (
    <div className="d-flex justify-content-center mt-5">
      <div className="card" style={{ width: '50%' }}>
        <div className="card-body">
          <h2 className="card-title text-center">Criar Unidade Curricular</h2>
          <CriarUCForm />
        </div>
      </div>
    </div>
  );
}
