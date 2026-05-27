import React, { useState } from "react";
import api from "../services/api";

interface TweetProps {
  id: number;
  message: string;
  img?: string;
  user: string;
  authorId?: number; // Adicionado para saber qual id seguir
  date: string;
  likes?: number;
  follow?: boolean;
  isLiked?: boolean;
  onToogleFollow?: () => void;
}

interface TweetPropsExtended extends TweetProps {
  onLike?: (id: number) => void;
  onDelete?: () => void;
}

type CommentItem = {
  id: number;
  message: string;
  user: string;
  date: string;
};

function Tweet({ id, message, user, authorId, date, likes, follow, img, isLiked, onToogleFollow, onLike }: TweetPropsExtended) {
  const displayLikes = likes ?? 0;
  
  const [showComments, setShowComments] = useState(false);
  const [commentsList, setCommentsList] = useState<CommentItem[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  
  const useBackend = Boolean(import.meta.env.VITE_API_BASE_URL);

  const handleToggleComments = async () => {
    const nextShow = !showComments;
    setShowComments(nextShow);
    
    if (nextShow && useBackend) {
      setLoadingComments(true);
      try {
        const data = await api.getComments(id);
        setCommentsList(data);
      } catch (err) {
        console.error('Erro ao carregar comentários:', err);
      } finally {
        setLoadingComments(false);
      }
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    if (useBackend) {
      try {
        const newComment = await api.postComment(id, { message: newCommentText });
        setCommentsList(prev => [...prev, newComment]);
        setNewCommentText('');
      } catch (err) {
        console.error('Erro ao submeter comentário:', err);
        alert('Erro ao enviar o comentário.');
      }
    } else {
      // Fallback local
      const mockComment: CommentItem = {
        id: Date.now(),
        message: newCommentText,
        user: 'offline_user',
        date: new Date().toISOString()
      };
      setCommentsList(prev => [...prev, mockComment]);
      setNewCommentText('');
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      return d.toLocaleDateString('pt-PT') + ' ' + d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString;
    }
  };

  const loggedInUserStr = localStorage.getItem('user');
  let currentUserId: number | null = null;
  if (loggedInUserStr) {
    try {
      currentUserId = JSON.parse(loggedInUserStr).id;
    } catch (e) {
      currentUserId = null;
    }
  }

  // Só mostra o botão de Seguir se houver um autor válido e não for o próprio utilizador logado
  const showFollowButton = authorId && currentUserId && authorId !== currentUserId;

  return ( 
    <article className="tweet-card">
      <header className="tweet-card-header">
        <div>
          <p className="tweet-card-user">@{user}</p>
          <p className="tweet-card-meta">Tweet #{id} · <span>{formatDate(date)}</span></p>
        </div>
        <div className="tweet-card-header-actions">
          {showFollowButton && (
            <button className={`tweet-follow-button ${follow ? 'follow-active' : ''}`} type="button" onClick={onToogleFollow}>
              {follow ? 'Seguindo' : 'Seguir'}
            </button>
          )}
        </div>
      </header>

      <p className="tweet-message">{message}</p>
      {img && (
        <div className="tweet-image-wrap">
          <img className="tweet-image" src={img} alt="tweet image" />
        </div>
      )}

      <footer className="tweet-card-footer" style={{ display: 'flex', gap: '20px' }}>
        <button
          className={`tweet-like-button ${isLiked ? 'liked' : ''}`}
          type="button"
          onClick={() => {
            onLike && onLike(id);
          }}
        >
          {isLiked ? '♥' : '♡'} {displayLikes}
        </button>

        <button
          className="tweet-comment-button"
          type="button"
          onClick={handleToggleComments}
        >
          💬 Comentários
        </button>
      </footer>

      {showComments && (
        <section className="tweet-comments-section">
          {loadingComments ? (
            <div style={{ color: 'var(--muted)', fontSize: '0.9rem', padding: '10px 0' }}>A carregar comentários...</div>
          ) : (
            <>
              <div className="comments-list">
                {commentsList.length === 0 ? (
                  <div style={{ color: 'var(--muted)', fontSize: '0.9rem', padding: '10px 0' }}>Nenhum comentário. Seja o primeiro a comentar!</div>
                ) : (
                  commentsList.map(c => (
                    <div key={c.id} className="comment-item">
                      <div className="comment-header">
                        <span className="comment-author">@{c.user}</span>
                        <span className="comment-date">{formatDate(c.date)}</span>
                      </div>
                      <p className="comment-text">{c.message}</p>
                    </div>
                  ))
                )}
              </div>
              
              <form className="comment-form" onSubmit={handleCommentSubmit}>
                <input
                  type="text"
                  className="comment-input"
                  placeholder="Escreva um comentário..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  maxLength={150}
                />
                <button
                  type="submit"
                  className="comment-submit-btn"
                  disabled={!newCommentText.trim()}
                >
                  Comentar
                </button>
              </form>
            </>
          )}
        </section>
      )}
    </article>
  );
}

export default Tweet;