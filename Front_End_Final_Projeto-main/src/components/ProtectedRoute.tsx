import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

export const ProtectedRoute = ({ children, requireAdmin = false }: { children: ReactNode; requireAdmin?: boolean }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('api_token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      setAuthenticated(true);
      try {
        const user = JSON.parse(userStr);
        setIsAdmin(user.role === 'admin');
      } catch (e) {
        setIsAdmin(false);
      }
    } else {
      setAuthenticated(false);
      setIsAdmin(false);
    }
    setLoading(false);
  }, []);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>A carregar...</div>;

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    // Se exige admin e não é admin, redireciona o utilizador normal para a página do feed
    return <Navigate to="/content" replace />;
  }

  return <>{children}</>;
};