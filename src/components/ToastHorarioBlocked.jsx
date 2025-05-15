import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const mostrarToastBloqueado = () => {
  toast.success("Horário bloqueado com sucesso!");
};

export const mostrarToastDesbloqueado = () => {
  toast.info("Horário desbloqueado com sucesso!");
};

