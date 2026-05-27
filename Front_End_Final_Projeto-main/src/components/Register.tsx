import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const res = await api.register({ username, email, password });
      if (res?.token) {
        api.setToken(res.token);
        localStorage.setItem('user', JSON.stringify(res.user || {}));
        navigate('/content');
      } else {
        setError('Erro ao registar utilizador.');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro no registo com o servidor.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleRegister}>
        <h2>Registar conta</h2>
        {error && <div className="history-item" style={{background: 'rgba(224,36,94,0.06)', color: 'var(--text)', padding: '10px', borderRadius: '5px', marginBottom: '15px'}}>{error}</div>}

        <div className="input-group">
          <label htmlFor="username">Nome de Utilizador</label>
          <input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="exemplo@dominio.com" />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="palavra-passe" />
        </div>

        <button className="login-button" type="submit">Registar</button>
        <div style={{marginTop:8}}>
          <small>Já tem conta? <Link to="/login">Entrar</Link></small>
        </div>
      </form>
    </div>
  );
}

export default Register;
