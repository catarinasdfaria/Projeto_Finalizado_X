import twitter_logo from '../../img/twitter_logo.png';
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { useEffect } from "react";

function Header() {
  const navigate = useNavigate(); 
  const useBackend = Boolean(import.meta.env.VITE_API_BASE_URL);

  useEffect(() => {
    if (useBackend) {
      const token = localStorage.getItem('api_token');
      const user = localStorage.getItem('user');
      if (!token || !user) {
        navigate("/login");
      }
    } else {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (!currentUser) {
          navigate("/");
        }
      });
      return () => unsubscribe();
    }
  }, [navigate, useBackend]);

  return (
    <div className="header-row justify-content-center">
      {/* O Header agora serve apenas para o logo centralizado e como atalho para o Feed (/content) */}
      <div>
        <button onClick={() => navigate("/content")} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <img src={twitter_logo} alt="logotipo" className="header-logo" style={{ height: '40px' }} />
        </button>
      </div>
    </div>
  )
}

export default Header;