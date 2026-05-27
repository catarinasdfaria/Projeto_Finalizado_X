import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from '../App';
import dashboardIcon from '../../img/dashboard.png';
import api from '../services/api';

function LeftMenu() {
  const { theme, setTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  // Obter o utilizador e verificar se é admin
  const userStr = localStorage.getItem('user');
  let isAdmin = false;
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      isAdmin = user.role === 'admin';
    } catch (e) {
      isAdmin = false;
    }
  }

  const handleLogout = async () => {
    try {
      // Chama o endpoint de logout formal no backend Express
      await api.logout();
    } catch (error) {
      console.warn("Aviso ao efetuar logout no servidor:", error);
    } finally {
      // Limpa os dados de autenticação locais em qualquer circunstância
      api.setToken(null);
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <div 
      className="sub-header-bar d-flex align-items-center justify-content-between w-100 px-4 py-2" 
      data-bs-theme={theme} 
    >
        
        {/* LADO ESQUERDO: Título e Navegação */}
        <div className="d-flex align-items-center gap-4">
            <span className="sub-header-title">Menu</span>
            
            {/* O botão do Dashboard só aparece se for admin */}
            {isAdmin && (
              <button 
                onClick={() => navigate("/dashboard")} 
                className="header-button sub-header-nav-btn d-flex align-items-center" 
              >
                  <img src={dashboardIcon} alt="dashboard" className="sub-header-icon" />
                  Dashboard
              </button>
            )}
        </div>

        {/* LADO DIREITO: Temas e Logout */}
        <div className="d-flex align-items-center gap-4">
            
            {/* Botões de Tema */}
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setTheme("ligth")} title="Modo Claro">☀️</button>
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setTheme("dark")} title="Modo Escuro">🌑</button>
            </div>
            
            {/* Botão de Logout */}
            <button 
              onClick={handleLogout} 
              className="logout-button sub-header-logout" 
            >
              Logout
            </button>
        </div>
        
    </div>
  );
}

export default LeftMenu;