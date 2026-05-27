
import { useContext } from "react";
import {ThemeContext} from '../App';
function Footer() {
    const theme = useContext(ThemeContext);


  return (
    
    <div className="row " data-bs-theme={theme}>
        <div className="col-12 ">
          O TwitterDemoMadeira é um projeto para fins de avaliação universitaria e pode cometer erros, inclusive sobre pessoas.Nada do que aqui é apresentado é real.
          <p>&copy; 2026 TwitterDemoMadeira. Todos os direitos reservados.</p>
        </div>
    </div>
  )
}

export default Footer