import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "../assets/logo_ipt.png";

export default function ImportarDados() {
    const [file, setFile] = useState(null);
    const [showInstructions, setShowInstructions] = useState(false);
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();

        if (!file) {
            alert('Por favor, selecione um ficheiro .xlsx');
            return;
        }

        navigate('/confirmar', { state: { file } });
    }

    return (
        <div className="container">
            <div className="row justify-content-center mt-5 g-4">/
                <div className="col-md-4 border p-5 rounded-3 bg-light shadow">
                    <img src={logo}
                        className="img-fluid d-block mx-auto mb-3"
                        style={{ maxWidth: "150px" }}
                        alt="logo" />
                    <h2 className="mb-4 text-center">Importar dados</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="file" className="form-label">Selecione o ficheiro .xlsx:</label>
                            <input
                                type="file"
                                accept=".xlsx"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="form-control"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn w-100 mb-3"
                            style={{ backgroundColor: '#71ba00', color: 'white', border: 'none' }}
                        >
                            Importar
                        </button>

                        <button
                            type="button"
                            className="btn w-100"
                            onClick={() => setShowInstructions(!showInstructions)}
                            style={{
                                backgroundColor: 'white',
                                color: '#71ba00',
                                border: '2px solid #71ba00',
                                fontWeight: 'bold'
                            }}
                        >
                            {showInstructions ? 'Esconder instruções' : 'Mostrar instruções'}
                        </button>
                    </form>
                </div>

                {showInstructions && (
                    <div className="col-md-6 border p-5 rounded-3 bg-light shadow mt-3">
                        <h4 className="mb-4 text-center">Formato esperado do ficheiro</h4>
                        <div className="table-responsive">
                            <table className="table table-bordered table-striped">
                                <thead className="table-light">
                                    <tr>
                                        <th>Folha</th>
                                        <th>Campos obrigatórios</th>
                                        <th>Notas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Escolas</td>
                                        <td><code>nome</code></td>
                                        <td>Nome da escola.</td>
                                    </tr>
                                    <tr>
                                        <td>Docentes</td>
                                        <td><code>nome</code>, <code>email</code></td>
                                        <td>Email deve ser válido.</td>
                                    </tr>
                                    <tr>
                                        <td>Cursos</td>
                                        <td><code>nome</code>, <code>nomeEscola</code></td>
                                        <td><code>nomeEscola</code> deve existir na folha "Escolas".</td>
                                    </tr>
                                    <tr>
                                        <td>Salas</td>
                                        <td><code>nome</code>, <code>nomeEscola</code></td>
                                        <td>Mesma validação de escola.</td>
                                    </tr>
                                    <tr>
                                        <td>UCs</td>
                                        <td><code>nome</code>, <code>plano</code>, <code>semestre</code>, <code>ano</code>, <code>listaCursos</code></td>
                                        <td>
                                            <ul className="mb-0">
                                                <li><code>listaCursos</code>: nomes separados por vírgulas</li>
                                                <li><code>semestre</code> e <code>ano</code>: numéricos</li>
                                            </ul>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
