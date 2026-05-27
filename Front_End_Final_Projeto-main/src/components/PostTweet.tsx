import React, { useState } from 'react';
import api from '../services/api';
import { auth } from '../config/firebase';

type Props = {
  onPosted?: (t: any) => void;
};

const MAX = 280;

function PostTweet({ onPosted }: Props) {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const useBackend = Boolean(import.meta.env.VITE_API_BASE_URL);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) {
      setImage(f);
      setPreview(URL.createObjectURL(f));
    } else {
      setImage(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (message.length > MAX) return;
    setLoading(true);

    let user = 'anon';
    if (useBackend) {
      try {
        const u = JSON.parse(localStorage.getItem('user') || '{}');
        user = u.username || 'anon';
      } catch (err) {
        console.error(err);
      }
    } else {
      const currentUser = auth.currentUser;
      user = currentUser?.displayName || currentUser?.email || 'anon';
    }

    try {
      if (useBackend) {
        const res = await api.postTweet({ message, image });
        if (onPosted) onPosted(res);
      } else {
        // create local tweet object and emit to parent
        const tweet = {
          id: Date.now(),
          message,
          img: preview || undefined,
          user,
          date: new Date().toISOString(),
          likes: 0,
          follow: true,
        };
        if (onPosted) onPosted(tweet);
      }
    } catch (err) {
      console.error('Erro ao publicar tweet', err);
    } finally {
      setLoading(false);
      setMessage('');
      setImage(null);
      setPreview(null);
    }
  };

  return (
    <form className="post-composer" onSubmit={handleSubmit}>
      <textarea
        className="post-textarea"
        placeholder="O que está a acontecer?"
        value={message}
        maxLength={MAX}
        onChange={(e) => setMessage(e.target.value)}
      />

      {preview && (
        <div className="post-image-preview">
          <img src={preview} alt="preview" />
        </div>
      )}

      <div className="post-actions">
        <label className="post-file">
          <input type="file" accept="image/*" onChange={handleFile} />
          Adicionar imagem
        </label>

        <div className="post-meta">
          <span className="post-count">{message.length}/{MAX}</span>
          <button className="login-button" type="submit" disabled={loading || !message.trim()}>{loading ? 'Publicando...' : 'Publicar'}</button>
        </div>
      </div>
    </form>
  );
}

export default PostTweet;
