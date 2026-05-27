import { useState, useEffect } from 'react';
import api from '../services/api';

type User = {
  id: string | number;
  username: string;
  email: string;
  role: 'admin' | 'user';
};

function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para o modo de edição
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState<{ username: string; email: string; role: 'admin' | 'user' }>({ username: '', email: '', role: 'user' });

  const useBackend = Boolean(import.meta.env.VITE_API_BASE_URL);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      if (useBackend) {
        // Obter os utilizadores através da API administrativa
        const res = await api.adminGetUsers();
        setUsers(res);
      } else {
        // Dados simulados fallback
        setUsers([
          { id: '1', username: 'admin_joao', email: 'joao@admin.com', role: 'admin' },
          { id: '2', username: 'maria_silva', email: 'maria@gmail.com', role: 'user' },
          { id: '3', username: 'carlos_dev', email: 'carlos@hotmail.com', role: 'user' },
        ]);
      }
    } catch (err: any) {
      console.error(err);
      setError('Erro ao carregar utilizadores do servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Tem a certeza que deseja eliminar este utilizador?')) return;
    
    try {
      if (useBackend) {
        await api.adminDeleteUser(id);
      }
      setUsers(users.filter(u => u.id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || 'Erro ao eliminar utilizador.');
    }
  };

  const startEdit = (user: User) => {
    setEditingUser(user);
    setEditForm({ username: user.username, email: user.email, role: user.role });
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      if (useBackend) {
        await api.adminUpdateUser(editingUser.id, editForm);
      }
      
      // Atualiza o estado local
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...editForm } : u));
      setEditingUser(null); // Fecha o modo de edição
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || 'Erro ao atualizar utilizador.');
    }
  };

  if (loading) return <div className="admin-loading">A carregar utilizadores...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-container">
      <h1 className="admin-title">Backoffice - Gestão de Utilizadores</h1>
      
      <table className="admin-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--border)' }}>
            <th>ID</th>
            <th>Nome de Utilizador</th>
            <th>E-mail</th>
            <th>Permissão</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
              
              {/* SE ESTIVER EM MODO DE EDIÇÃO */}
              {editingUser?.id === user.id ? (
                <>
                  <td>{user.id}</td>
                  <td>
                    <input 
                      value={editForm.username} 
                      onChange={(e) => setEditForm({...editForm, username: e.target.value})} 
                      style={{ padding: '4px', borderRadius: '4px', border: '1px solid var(--accent)' }}
                    />
                  </td>
                  <td>
                    <input 
                      value={editForm.email} 
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})} 
                      style={{ padding: '4px', borderRadius: '4px', border: '1px solid var(--accent)' }}
                    />
                  </td>
                  <td>
                    <select 
                      value={editForm.role} 
                      onChange={(e) => setEditForm({...editForm, role: e.target.value as 'admin' | 'user'})}
                      style={{ padding: '4px', borderRadius: '4px', border: '1px solid var(--accent)' }}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <button className="btn-save" onClick={handleSaveEdit} style={{ marginRight: '8px', color: 'green', background: 'transparent', border: '1px solid green', padding: '2px 8px', borderRadius: '4px' }}>Salvar</button>
                    <button className="btn-cancel" onClick={() => setEditingUser(null)} style={{ color: 'var(--muted)', background: 'transparent', border: '1px solid var(--muted)', padding: '2px 8px', borderRadius: '4px' }}>Cancelar</button>
                  </td>
                </>
              ) : (
                /* SE ESTIVER EM MODO DE VISUALIZAÇÃO NORMAL */
                <>
                  <td>{user.id}</td>
                  <td>@{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span style={{ 
                      background: user.role === 'admin' ? 'rgba(224,36,94,0.1)' : '#eee', 
                      padding: '2px 8px', borderRadius: '10px' 
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <button className="btn-edit" onClick={() => startEdit(user)} style={{ marginRight: '8px', color: 'var(--accent)', background: 'transparent', border: '1px solid var(--accent)', padding: '2px 8px', borderRadius: '4px' }}>Editar</button>
                    <button className="btn-delete" onClick={() => handleDelete(user.id)} style={{ color: 'red', background: 'transparent', border: '1px solid red', padding: '2px 8px', borderRadius: '4px' }}>Excluir</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;