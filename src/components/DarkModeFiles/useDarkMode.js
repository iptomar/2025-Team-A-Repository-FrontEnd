import { useEffect, useState } from "react"; // Importa useEffect e useState do React

// Hook personalizado para verificar o modo escuro
export default function useDarkMode() {

  // Estado para armazenar se o modo escuro está ativo
  const [isDarkMode, setIsDarkMode] = useState(document.body.classList.contains("dark-mode"));

  // Efeito para observar mudanças na classe do body
  useEffect(() => {
    // Cria um MutationObserver para observar mudanças na classe do body
    const observer = new MutationObserver(() => {
      // Atualiza o estado isDarkMode com base na presença da classe "dark-mode"  
      setIsDarkMode(document.body.classList.contains("dark-mode"));
    });

    // Inicia a observação do body, monitorando mudanças de atributos e filtrando pela classe
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    // Limpa o observer quando o componente é desmontado
    return () => observer.disconnect();
  }, 
  // Dependências vazias para que o efeito seja executado apenas uma vez após o primeiro render
  []);

  // Retorna o estado isDarkMode para que outros componentes possam usá-lo
  return isDarkMode;
}