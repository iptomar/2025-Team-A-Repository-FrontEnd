import React from 'react';
import { toast } from 'react-toastify';

export default function ToastConfirmaDelete({ id, action, closeToast, item, reloadLista }) {
  const confirmDelete = (isConfirmed) => {
    if (isConfirmed) {
      action(id);  // Chama a função para apagar 
      reloadLista();  // Atualiza a lista depois de apagar
    } else {
      toast.info('Ação cancelada');
    }
    closeToast();  // Fecha o toast de confirmação
  };

  return (
    <div style={styles.toastContainer}>
      <p style={styles.toastText}>Tem a certeza que deseja eliminar {item}?</p>
      <div style={styles.buttonContainer}>
        <button
          style={styles.buttonYes}
          onClick={() => confirmDelete(true)}
        >
          Sim
        </button>
        <button
          style={styles.buttonNo}
          onClick={() => confirmDelete(false)}
        >
          Não
        </button>
      </div>
    </div>
  );
}

const styles = {
  toastContainer: {
    backgroundColor: '#fff',
    borderLeft: '4px solid #e74c3c',
    color: '#2c3e50',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    margin: 'auto',
  },
  toastText: {
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '20px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  buttonYes: {
    flex: 1,
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    marginRight: '10px',
    transition: 'background-color 0.3s',
  },
  buttonNo: {
    flex: 1,
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s',
  },
};
