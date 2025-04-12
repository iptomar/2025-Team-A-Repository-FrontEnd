import ItemSala from './item_sala';

function ListaSalas({ salas, setSalas }) {
    return (
      <div className="container mt-4">
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Escola</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {salas.map((sala) => (
                <ItemSala key={sala.id} sala={sala} setSalas={setSalas} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

export default ListaSalas;