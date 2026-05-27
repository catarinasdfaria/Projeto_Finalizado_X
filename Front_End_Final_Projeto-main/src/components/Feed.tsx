import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../App';
import Tweet from './Tweet';
import PostTweet from './PostTweet';
import initialTweets from '../db/tweets.json';
import api from '../services/api';

type TweetItem = {
  id: number;
  message: string;
  img?: string;
  user: string;
  authorId?: number;
  date: string;
  likes?: number;
  follow?: boolean;
  isLiked?: boolean;
};

function Feed() {
  const [tweetData, setTweetData] = useState<TweetItem[]>([]);
  const useBackend = Boolean(import.meta.env.VITE_API_BASE_URL);

  const getData = async () => {
    try {
      if (useBackend) {
        const data = await api.getTweets();
        if (Array.isArray(data)) {
          setTweetData(data);
        } else {
          setTweetData(initialTweets);
        }
      } else {
        setTweetData(initialTweets);
      }
    } catch (error) {
      console.error('Erro ao carregar tweets:', error);
      setTweetData(initialTweets);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handlePosted = (t: TweetItem | any) => {
    setTweetData((prev) => [t, ...prev]);
  };

  const handleToggleFollow = async (authorId?: number, authorName?: string) => {
    if (!authorId || !useBackend) return;

    try {
      const res = await api.followUser(authorId);
      // Atualiza o estado de follow em todos os tweets do mesmo autor no feed
      setTweetData((prev) => prev.map((t) => 
        t.user === authorName ? { ...t, follow: res.followed } : t
      ));
    } catch (err) {
      console.error('Erro ao seguir utilizador:', err);
      alert('Não foi possível processar a ação de seguir.');
    }
  };
  
  const tema = useContext(ThemeContext);

  const handleLike = async (id: number) => {
    // Atualização otimista no frontend
    setTweetData((prev) => prev.map((t) => {
      if (t.id === id) {
        const currentlyLiked = t.isLiked || false;
        return { 
          ...t, 
          isLiked: !currentlyLiked, 
          likes: (t.likes ?? 0) + (currentlyLiked ? -1 : 1)
        };
      }
      return t;
    }));

    if (useBackend) {
      try {
        await api.likeTweet(id);
      } catch (err) {
        console.warn('Like failed', err);
        // Desfazer atualização otimista se falhar no backend
        setTweetData((prev) => prev.map((t) => {
          if (t.id === id) {
            const currentlyLiked = t.isLiked || false;
            return { 
              ...t, 
              isLiked: !currentlyLiked, 
              likes: (t.likes ?? 0) + (currentlyLiked ? -1 : 1)
            };
          }
          return t;
        }));
      }
    }
  };

  return (
    <>
      <PostTweet onPosted={handlePosted} />
      <div className={`feed-root Main-menu ${tema.theme}`}>
        <div className="feed-grid">
          <section className="feed-column feed-column-following">
            <h1 className="feed-title">Feed do que estou a seguir</h1>
            <div className="feed-list">
              {tweetData.map((t) => (
                t.follow === true ? (
                  <article key={t.id} className="feed-list-item">
                    <Tweet 
                      {...t} 
                      onToogleFollow={() => handleToggleFollow(t.authorId, t.user)} 
                      onLike={() => handleLike(t.id)}
                    />
                  </article>
                ) : null
              ))}
            </div>
          </section>

          <section className="feed-column feed-column-all">
            <h1 className="feed-title">Feed Completo</h1>
            <div className="feed-list">
              {tweetData.map((t) => (
                <article key={t.id} className="feed-list-item">
                  <Tweet 
                    {...t} 
                    onToogleFollow={() => handleToggleFollow(t.authorId, t.user)} 
                    onLike={() => handleLike(t.id)} 
                  />
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Feed;