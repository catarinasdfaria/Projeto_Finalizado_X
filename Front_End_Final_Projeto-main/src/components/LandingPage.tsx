import { useNavigate } from 'react-router-dom';
import twitter_logo from "../../img/twitter_logo.png"
function LandingPage() {
  const navigate = useNavigate();
  
  return (
    <div className="x-landing-wrapper">
      <div className="x-landing-hero">
        <div className="x-landing-content">
          <h1 className="x-landing-title">Bem-vindo ao Twitter da Madeira</h1>
          <p className="x-landing-subtitle">
            Junte-se a milhões de utilizadores e comece a interagir hoje!
          </p>
          <img src={twitter_logo} alt="logotipo"  style={{maxWidth:"300px", maxHeight:"300px"}}/>
          
          <div className="x-landing-actions">
            <button 
              className="x-btn-login" 
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button 
              className="x-btn-register" 
              onClick={() => navigate('/register')}
            >
              Registar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;