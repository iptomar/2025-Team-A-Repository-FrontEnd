import EditarUCForm from "../components/EditarUCForm/EditarUCForm"; // Importa o componente do formulário

export default function EditarUC() {  
  return (
    <div className="d-flex justify-content-center mt-5">
      <div className="card" style={{ width: '50%' }}>
        <div className="card-body">
          <h2 className="card-title text-center">Editar Unidade Curricular</h2>
          <EditarUCForm />
        </div>
      </div>
    </div>
  );
}
