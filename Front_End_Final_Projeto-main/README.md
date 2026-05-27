# Front Project API Gemini Madeira

> Projeto de avaliação front-end desenvolvido para a universidade com integração à API Gemini Studio.

## 📋 Sobre o Projeto

Este é um projeto educacional de front-end que demonstra a integração com a API Gemini Studio. O projeto foi desenvolvido como trabalho de avaliação universitária e utiliza tecnologias modernas para criar uma interface interativa conectada a serviços de IA.

## 🛠️ Stack Tecnológico

O projeto é composto pelas seguintes tecnologias:

- **TypeScript**: 63% - Tipagem estática e segurança de tipo
- **CSS**: 33.5% - Estilização e design responsivo
- **JavaScript**: 2.2% - Lógica e interatividade
- **HTML**: 1.3% - Estrutura e marcação semântica

## 🚀 Funcionalidades

- Integração com API Gemini Studio
- Interface responsiva e intuitiva
- Tipagem segura com TypeScript
- Design moderno com CSS customizado

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 16.x ou superior)
- **npm** ou **yarn**
- Uma chave de API válida do Gemini Studio

## 🔧 Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/Jlcdias/FRONTPROJECTAPIGEMINIMADEIRA.git
cd FRONTPROJECTAPIGEMINIMADEIRA
```

2. **Instale as dependências:**
```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto:
```env
VITE_GEMINI_API_KEY=sua_chave_api_aqui
VITE_GEMINI_API_URL=https://api.gemini.studio/v1
```

4. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
# ou
yarn dev
```

O projeto estará disponível em `http://localhost:5173` (ou porta configurada).

## 📝 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev           # Inicia servidor de desenvolvimento

# Build
npm run build         # Cria versão otimizada para produção
npm run preview       # Pré-visualiza build de produção localmente

# Qualidade de código
npm run lint          # Verifica padrão de código
npm run type-check    # Verifica tipos TypeScript
```

## 🏗️ Estrutura do Projeto

```
FRONTPROJECTAPIGEMINIMADEIRA/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   ├── pages/           # Páginas da aplicação
│   ├── styles/          # Estilos globais e módulos CSS
│   ├── services/        # Serviços e integrações de API
│   ├── types/           # Definições de tipos TypeScript
│   ├── utils/           # Funções utilitárias
│   ├── App.tsx          # Componente principal
│   └── main.tsx         # Ponto de entrada
├── public/              # Arquivos estáticos
├── .env.example         # Exemplo de variáveis de ambiente
├── package.json         # Dependências do projeto
├── tsconfig.json        # Configuração TypeScript
├── vite.config.ts       # Configuração Vite
└── README.md           # Este arquivo
```

## 🔐 Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|------------|
| `VITE_GEMINI_API_KEY` | Chave de autenticação da API Gemini | ✅ Sim |
| `VITE_GEMINI_API_URL` | URL base da API Gemini Studio | ✅ Sim |

## 🔌 Integração Gemini API

### Exemplo de Uso

```typescript
import { geminiService } from './services/gemini';

// Fazer uma requisição à API
const response = await geminiService.chat({
  message: 'Olá, como você pode me ajudar?'
});

console.log(response.data);
```

Consulte a documentação oficial da [API Gemini Studio](https://gemini.studio) para mais detalhes.

## 🎨 Estilos e Design

O projeto utiliza CSS moderno com:
- Variáveis CSS para temas
- Design Responsivo (Mobile-First)
- Acessibilidade em mente
- Componentes estilizados e reutilizáveis

## 🧪 Testes

Para executar testes (se configurados):

```bash
npm run test           # Executa suite de testes
npm run test:watch    # Modo watch para testes
npm run test:coverage # Cobertura de testes
```

## 🚀 Deploy

### Build para Produção

```bash
npm run build
```

Os arquivos compilados estarão em `dist/`.

### Opções de Deploy

- **Vercel**: Integração automática com push ao GitHub
- **Netlify**: Deploy contínuo e automático
- **GitHub Pages**: Deploy estático gratuito
- **Servidor Próprio**: Qualquer servidor HTTP

## 📚 Documentação Adicional

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Gemini Studio API Docs](https://gemini.studio/docs)
- [Guia de Configuração Completa](./docs/SETUP.md)
- [Arquitetura do Projeto](./docs/ARCHITECTURE.md)

## 🐛 Reporte de Issues

Se encontrar bugs ou tiver sugestões:

1. Abra uma [Issue](https://github.com/Jlcdias/FRONTPROJECTAPIGEMINIMADEIRA/issues)
2. Descreva o problema ou sugestão detalhadamente
3. Inclua prints ou exemplos se possível

## 🤝 Contribuição

Contribuições são bem-vindas! Verifique [CONTRIBUTING.md](./CONTRIBUTING.md) para mais detalhes.

## 📄 Licença

Este projeto é fornecido como trabalho acadêmico. Verifique com seu instrutor sobre a licença apropriada.

## 👤 Autor

**Jlcdias**

- GitHub: [@Jlcdias](https://github.com/Jlcdias)
- Repositório: [FRONTPROJECTAPIGEMINIMADEIRA](https://github.com/Jlcdias/FRONTPROJECTAPIGEMINIMADEIRA)

## 📞 Suporte

Para dúvidas ou suporte, abra uma issue no repositório ou entre em contato pelo GitHub.

---

**Última atualização:** 13 de maio de 2026

> ⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!
