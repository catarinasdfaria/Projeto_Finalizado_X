import React, { useState } from 'react';
import account from '../../img/account.png';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      const res = await api.login({ identifier: email, password });
      if (res?.token) {
        api.setToken(res.token);
        localStorage.setItem('user', JSON.stringify(res.user || {}));
        navigate('/content');
      } else {
        setError('Credenciais inválidas');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro no login com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <img src={account} alt="logotipo" style={{ height: "50px" }} />
          <h2>Bem-vindo ao Twitter da Madeira</h2>
          <p>Introduza os seus dados para aceder</p>

          {error && (
            <div className="history-item" style={{ background: 'rgba(224,36,94,0.06)', color: 'var(--text)', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
              {error}
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email">Email ou username</label>
            <input
              type="text"
              onChange={(event) => setEmail(event.target.value)}
              value={email}
              id="email"
              placeholder="exemplo@dominio.com ou username"
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Palavra-passe</label>
            <input
              type="password"
              onChange={(event) => setPassword(event.target.value)}
              value={password}
              id="password"
              placeholder="palavra-passe"
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
          
          <div style={{ marginTop: 8, textAlign: 'center' }}>
            <small>Não tem conta? <Link to="/register">Registar</Link></small>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;