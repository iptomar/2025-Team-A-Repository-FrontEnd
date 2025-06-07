import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "../assets/logo_ipt.png";

export default function ImportarDados() {
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();

        if (!file) {
            alert('Por favor, selecione um ficheiro .xlsx');
            return;
        }

        // Navegar para a página de confirmação e passar o ficheiro através do state
        navigate('/confirmar', { state: { file } });
    }

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
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
                            className="btn w-100"
                            style={{ backgroundColor: '#71ba00', color: 'white', border: 'none' }}
                        >
                            Importar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
