
import { Link } from 'react-router-dom';

function ErrorPage() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
        <h1>Erro 404</h1>
        <p>A página que procura não existe.</p>
        <h2>
          <Link to="/">Clique aqui para voltar à página inicial</Link>
        </h2>
    </div>
  );
}

export default ErrorPage;