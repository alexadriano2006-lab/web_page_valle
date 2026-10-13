# Valle Viação — site estático

Abra `index.html` no navegador ou, na pasta `mockserver`, execute `npm install` e `npm start`. O site estará em `http://127.0.0.1:3015`. As páginas não precisam de build nem de dependências de front-end.

Para abrir o painel demonstrativo, execute `npm run start:admin` e acesse `http://127.0.0.1:3010`. Seus dados permanecem apenas na sessão do navegador. `npm test` verifica os dois servidores, os arquivos referenciados pelas páginas e as respostas para caminhos inexistentes.

## Páginas

- `index.html`: página inicial.
- `sobre/index.html`: apresentação institucional e artigos.
- `servicos/index.html`: serviços de transporte.
- `veiculos/index.html`: categorias de veículos.

## Estilos e scripts

- `styles.css`: estilos compartilhados, navegação, rodapé e regras responsivas.
- `styles/inicio.css`: página inicial.
- `styles/sobre.css`: página institucional.
- `styles/servicos.css`: página de serviços.
- `styles/veiculos.css`: página de veículos.
- `scripts/menu.js`: menu em telas menores e carrossel com setas, pausa automática durante a interação e respeito à preferência por movimento reduzido.

Os perfis de redes sociais estão identificados no rodapé, aguardando os links oficiais. Não há formulário de cotação nem backend integrado; os botões de contato direcionam para o WhatsApp.

Os links públicos usam `/sobre/`, `/servicos/` e `/veiculos/`. Os arquivos antigos em `paginas/` redirecionam para os novos endereços, preservando parâmetros e âncoras.
