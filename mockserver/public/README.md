# Valle Viação — site estático

Abra `index.html` no navegador ou, na pasta `mockserver`, execute `npm install` e `npm start`. O site estará em `http://127.0.0.1:3015`. As páginas não precisam de build nem de dependências de front-end.

Para abrir o painel demonstrativo, execute `npm run start:admin` e acesse `http://127.0.0.1:3010`. Seus dados permanecem apenas na sessão do navegador. `npm test` verifica os dois servidores, os arquivos referenciados pelas páginas e as respostas para caminhos inexistentes.

## Páginas

- `index.html`: página inicial.
- `sobre/index.html`: apresentação institucional e artigos.
- `servicos/index.html`: serviços de transporte.
- `veiculos/index.html`: categorias de veículos.
- `veiculos/detalhes/*.html`: fichas dos veículos, acessíveis diretamente ou pelo modal da página de veículos.

## Estilos e scripts

- `styles.css`: estilos compartilhados, navegação, rodapé e regras responsivas.
- `styles/inicio.css`: página inicial.
- `styles/sobre.css`: página institucional.
- `styles/servicos.css`: página de serviços.
- `styles/veiculos.css`: página de veículos.
- `styles/ficha-veiculo.css`: fichas dos veículos.
- `scripts/menu.js`: menu em telas menores, normalização dos endereços com `index.html` e animações de entrada com respeito à preferência por movimento reduzido.
- `scripts/veiculos.js`: abertura e fechamento do modal com as fichas dos veículos.

Os perfis de redes sociais estão vinculados no rodapé. Não há formulário de cotação nem backend integrado; os botões de contato direcionam para o WhatsApp.

Os links públicos usam `/sobre/`, `/servicos/` e `/veiculos/`. Os arquivos antigos em `paginas/` redirecionam para os novos endereços, preservando parâmetros e âncoras.
