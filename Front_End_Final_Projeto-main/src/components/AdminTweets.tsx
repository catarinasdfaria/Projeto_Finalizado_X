import { useState, useEffect } from 'react';
import api from '../services/api'; 
import localTweets from '../db/tweets.json';

type Tweet = {
  id: number;
  user: string;
  message: string;
  date: string;
  likes?: number;
  img?: string;
};

function AdminTweets() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingTweet, setEditingTweet] = useState<Tweet | null>(null);
  const [editMessage, setEditMessage] = useState('');
  const [editImg, setEditImg] = useState<string | undefined>(undefined);

  const useBackend = Boolean(import.meta.env.VITE_API_BASE_URL);

  useEffect(() => {
    fetchTweets();
  }, []);

  const fetchTweets = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (useBackend) {
        const data = await api.getTweets();
        if (Array.isArray(data)) {
          setTweets(data);
        } else if (data && data.data && Array.isArray(data.data)) {
          setTweets(data.data);
        } else {
          setTweets(localTweets as unknown as Tweet[]);
        }
      } else {
        setTweets(localTweets as unknown as Tweet[]);
        setError('A mostrar dados do ficheiro local (tweets.json) pois a base de dados está vazia.');
      }
    } catch (err) {
      console.error('Erro de API:', err);
      setTweets(localTweets as unknown as Tweet[]);
      setError('Aviso: Não foi possível ligar ao Backend real. A carregar os tweets do ficheiro tweets.json.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Atenção: Tem a certeza que deseja eliminar este tweet? Esta ação é irreversível.')) return;
    try {
      if (useBackend) {
        await api.adminDeleteTweet(id);
      }
      setTweets(tweets.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
      alert('Erro ao eliminar o tweet.');
    }
  };

  const startEdit = (tweet: Tweet) => {
    setEditingTweet(tweet);
    setEditMessage(tweet.message);
    setEditImg(tweet.img);
  };

  const handleSaveEdit = async () => {
    if (!editingTweet) return;
    if (editMessage.length > 280) {
      alert('A mensagem não pode exceder os 280 caracteres.');
      return;
    }
    try {
      if (useBackend) {
        // Envia o update para a base de dados
        await api.adminUpdateTweet(editingTweet.id, { 
          message: editMessage, 
          removeImage: !editImg // se editImg for undefined, remove a imagem
        });
      }
      
      setTweets(tweets.map(t => t.id === editingTweet.id ? { ...t, message: editMessage, img: editImg } : t));
      setEditingTweet(null);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || 'Erro ao atualizar o tweet.');
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return isoString; 
      return date.toLocaleDateString('pt-PT') + ' ' + date.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString;
    }
  };

  if (loading) return <div className="admin-loading" style={{textAlign: 'center', padding: '40px'}}>A carregar tweets...</div>;

  const safeTweets = Array.isArray(tweets) ? tweets : [];

  return (
    <div className="admin-container">
      <h1 className="admin-title" style={{ marginTop: 0, borderBottom: '1px solid var(--input-border)', paddingBottom: '16px', marginBottom: '24px' }}>
        Backoffice - Gestão de Tweets
      </h1>
      
      {error && (
        <div className="admin-error-box">
          {error}
        </div>
      )}
      
      <table className="admin-table">
        <thead>
          <tr>
            <th className="col-id">ID</th>
            <th className="col-author">Autor</th>
            <th className="col-message">Mensagem</th>
            <th className="col-date">Data</th>
            <th className="col-likes">Likes</th>
            <th className="col-actions">Ações</th>
          </tr>
        </thead>
        <tbody>
          {safeTweets.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>
                Nenhum tweet encontrado.
              </td>
            </tr>
          ) : (
            safeTweets.map((tweet) => (
              <tr key={tweet.id}>
                
                {editingTweet?.id === tweet.id ? (
                  <>
                    <td>{tweet.id}</td>
                    <td>@{tweet.user}</td>
                    <td>
                      <textarea 
                        className="admin-textarea"
                        value={editMessage} 
                        onChange={(e) => setEditMessage(e.target.value)}
                        maxLength={280}
                        style={{ width: '100%', minHeight: '80px', padding: '8px', borderRadius: '8px', border: '1px solid var(--accent)' }}
                      />
                      <div style={{ fontSize: '0.8rem', color: editMessage.length >= 280 ? 'red' : 'var(--muted)' }}>
                        {editMessage.length}/280
                      </div>
                      
                      {editImg && (
                        <div className="admin-tweet-img-wrapper edit-mode-img" style={{ position: 'relative', display: 'inline-block' }}>
                          <img src={editImg} alt="Anexo" className="admin-tweet-thumbnail" />
                          <button 
                            onClick={() => setEditImg(undefined)}
                            title="Remover Imagem"
                            style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#e0245e', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="tweet-date">{formatDate(tweet.date)}</td>
                    <td style={{ textAlign: 'center' }}>{tweet.likes ?? 0}</td>
                    <td className="action-buttons-column">
                      <button className="btn-save" onClick={handleSaveEdit}>Salvar</button>
                      <button className="btn-cancel" onClick={() => setEditingTweet(null)}>Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{tweet.id}</td>
                    <td className="tweet-author">@{tweet.user}</td>
                    <td className="tweet-text">
                      {tweet.message}
                      {tweet.img && (
                        <div className="admin-tweet-img-wrapper">
                          <img src={tweet.img} alt="Anexo" className="admin-tweet-thumbnail" />
                        </div>
                      )}
                    </td>
                    <td className="tweet-date">{formatDate(tweet.date)}</td>
                    <td style={{ textAlign: 'center' }}>{tweet.likes ?? 0}</td>
                    <td className="action-buttons-column">
                      <button className="btn-edit" onClick={() => startEdit(tweet)}>Editar</button>
                      <button className="btn-delete" onClick={() => handleDelete(tweet.id)}>Excluir</button>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTweets;