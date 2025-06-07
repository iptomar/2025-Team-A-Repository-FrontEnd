import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';

export default function ConfirmarImportacao() {
    const [sheets, setSheets] = useState([]);
    const [currentSheetIndex, setCurrentSheetIndex] = useState(0);
    const [data, setData] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const file = location.state?.file;

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const ab = e.target.result;
                const workbook = XLSX.read(ab, { type: 'array' });
                const sheetsData = workbook.SheetNames.map((sheetName) => ({
                    name: sheetName,
                    data: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 })
                }));
                setSheets(sheetsData);
                setData(sheetsData[0].data);
            };
            reader.readAsArrayBuffer(file);
        }
    }, [location.state?.file]);

    const handleSheetChange = (index) => {
        setCurrentSheetIndex(index);
        setData(sheets[index].data);
    };

    const handleEditData = (rowIndex, colIndex, value) => {
        const updatedData = [...data];
        updatedData[rowIndex][colIndex] = value;
        setData(updatedData);
    };

    const handlePublish = async () => {
        const formattedPayload = {
            listaEscolas: [],
            listaDocentes: [],
            listaCursos: [],
            listaSalas: [],
            listaUCs: [],
        };

        let validationErrors = [];

        sheets.forEach(sheet => {
            const sheetName = sheet.name.toLowerCase();
            const headers = sheet.data[0];
            const rows = sheet.data.slice(1);

            rows.forEach((row, rowIndex) => {
                const rowObj = {};
                headers.forEach((header, i) => {
                    rowObj[header] = row[i];
                });

                switch (sheetName) {
                    case 'escolas':
                        if (!rowObj.nome) {
                            validationErrors.push(`Linha ${rowIndex + 2} da folha "Escolas": Campo 'nome' é obrigatório.`);
                        } else {
                            formattedPayload.listaEscolas.push({ nome: rowObj.nome });
                        }
                        break;

                    case 'docentes':
                        if (!rowObj.nome || !rowObj.email) {
                            validationErrors.push(`Linha ${rowIndex + 2} da folha "Docentes": Campos 'nome' e 'email' são obrigatórios.`);
                        } else {
                            formattedPayload.listaDocentes.push({ nome: rowObj.nome, email: rowObj.email });
                        }
                        break;

                    case 'cursos':
                        if (!rowObj.nome || !rowObj.nomeEscola) {
                            validationErrors.push(`Linha ${rowIndex + 2} da folha "Cursos": Campos 'nome' e 'nomeEscola' são obrigatórios.`);
                        } else {
                            formattedPayload.listaCursos.push({ nome: rowObj.nome, nomeEscola: rowObj.nomeEscola });
                        }
                        break;

                    case 'salas':
                        if (!rowObj.nome || !rowObj.nomeEscola) {
                            validationErrors.push(`Linha ${rowIndex + 2} da folha "Salas": Campos 'nome' e 'nomeEscola' são obrigatórios.`);
                        } else {
                            formattedPayload.listaSalas.push({ nome: rowObj.nome, nomeEscola: rowObj.nomeEscola });
                        }
                        break;

                    case 'ucs':
                        if (!rowObj.nome || !rowObj.plano || rowObj.semestre === undefined || rowObj.ano === undefined || !rowObj.listaCursos) {
                            validationErrors.push(`Linha ${rowIndex + 2} da folha "UCs": Campos 'nome', 'plano', 'semestre', 'ano' e 'listaCursos' são obrigatórios.`);
                        } else {
                            const cursosArray = typeof rowObj.listaCursos === "string"
                                ? rowObj.listaCursos.split(',').map(c => c.trim())
                                : [];

                            formattedPayload.listaUCs.push({
                                nome: rowObj.nome,
                                plano: String(rowObj.plano),
                                semestre: parseInt(rowObj.semestre),
                                ano: parseInt(rowObj.ano),
                                listaCursos: cursosArray
                            });
                        }
                        break;

                    default:
                        toast.warn(`Folha "${sheet.name}" ignorada. Nome não reconhecido.`);
                }
            });
        });

        if (validationErrors.length > 0) {
            validationErrors.forEach(error => toast.error(error));
            return;
        }

        try {
            console.log("JSON a enviar:", JSON.stringify(formattedPayload, null, 2));

            const response = await fetch("http://localhost:5251/importar", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formattedPayload)
            });

            if (!response.ok) {
                const errorBody = await response.json();
                toast.error(`Erro ao importar: ${errorBody.message || 'Erro desconhecido.'}`);
            } else {
                toast.success('Importação realizada com sucesso!');
            }
        } catch (err) {
            toast.error(`Erro de rede: ${err.message}`);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-12">
                    <h2 className="mb-4">Confirmação de Importação</h2>
                    <div>
                        <div className="btn-group mb-4">
                            {sheets.map((sheet, index) => (
                                <button
                                    key={index}
                                    className={`btn btn-${currentSheetIndex === index ? 'primary' : 'secondary'}`}
                                    onClick={() => handleSheetChange(index)}
                                >
                                    {sheet.name}
                                </button>
                            ))}
                        </div>

                        <div className="table-responsive" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            <table className="table table-bordered">
                                <thead style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
                                    <tr>
                                        {data[0]?.map((colTitle, index) => (
                                            <th key={index} style={{ minWidth: '150px', maxWidth: '250px' }}>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={colTitle}
                                                    onChange={(e) => handleEditData(0, index, e.target.value)}
                                                    style={{ fontWeight: 'bold' }}
                                                />
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.slice(1).map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {row.map((cell, colIndex) => (
                                                <td key={colIndex} style={{ minWidth: '150px', maxWidth: '250px' }}>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={cell}
                                                        onChange={(e) => handleEditData(rowIndex + 1, colIndex, e.target.value)}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="text-center mt-4">
                            <button className="btn btn-success" onClick={handlePublish} style={{ backgroundColor: '#71ba00', color: 'white', border: 'none' }}>Publicar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
