import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as XLSX from 'xlsx'; 
import 'bootstrap/dist/css/bootstrap.min.css';

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

    const handleRemoveRow = (rowIndex) => {
        const updatedData = [...data];
        updatedData.splice(rowIndex, 1);
        setData(updatedData);
    };

    const handleRemoveColumn = (colIndex) => {
        const updatedData = data.map(row => {
            const newRow = [...row];
            newRow.splice(colIndex, 1);
            return newRow;
        });
        setData(updatedData);
    };

    const handlePublish = () => {
        console.log('Publicar:', data);
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
                                <thead>
                                    
                                    <tr>
                                        {data[0]?.map((_, colIndex) => (
                                            <th key={`remove-${colIndex}`} style={{ minWidth: '150px', maxWidth: '250px' }}>
                                                <button
                                                    className="btn btn-sm btn-danger w-100"
                                                    onClick={() => handleRemoveColumn(colIndex)}
                                                >
                                                    Remover Coluna
                                                </button>
                                            </th>
                                        ))}
                                        <th></th>
                                    </tr>
                                   
                                    <tr style={{ backgroundColor: '#f8f9fa', fontWeight: 'bold' }}>
                                        {data[0]?.map((colTitle, index) => (
                                            <th key={`header-${index}`} style={{ minWidth: '150px', maxWidth: '250px' }}>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={colTitle}
                                                    onChange={(e) => handleEditData(0, index, e.target.value)}
                                                    style={{ fontWeight: 'bold' }}
                                                />
                                            </th>
                                        ))}
                                        <th>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleRemoveRow(0)}>
                                                Remover Títulos
                                            </button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.slice(1).map((row, rowIndex) => (
                                        <tr key={rowIndex + 1}>
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
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => handleRemoveRow(rowIndex + 1)}
                                                >
                                                    Remover Linha
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="text-center mt-4">
                            <button className="btn btn-success" onClick={handlePublish}>Publicar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
