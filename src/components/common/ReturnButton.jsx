import {useNavigate} from 'react-router-dom';
import { toast } from "react-toastify";

export default function ReturnButton({text, endpoint }) {
    const navigate = useNavigate();
    return (
        <button 
            type="button"
            className="btn btn-secondary" 
            onClick={() => {
                toast.dismiss();
                navigate(endpoint)}}
        >
            {text}
        </button>
    );
  }            
            
        