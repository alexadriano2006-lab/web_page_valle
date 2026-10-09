# Valle Viação — front estático

Abra `index.html` no navegador. O projeto funciona sem instalação, build, fontes externas ou dependências. Para testar com servidor: `python3 -m http.server 8000 --directory valle-front`, executado na pasta que contém o projeto.

## Arquivos
- `index.html`: página institucional, serviços, veículos e formulário.
- `styles.css`: layout responsivo branco/laranja e acessibilidade.
- `app.js`: menu, validações e integração futura com API.

A identidade usa um wordmark textual provisório, não o logo oficial. O ônibus é uma ilustração, não uma fotografia da frota. Substitua pelos arquivos oficiais antes da publicação. Não foram incluídos números de contato, capacidades ou certificações não confirmadas.

## Formulário e backend
Por padrão, `modoDemonstracao: true`. Nenhuma requisição é enviada; nenhum dado é salvo em localStorage ou banco. O formulário não limpa os campos na demonstração.

Para integrar:
1. Configure `endpointCotacao` em `app.js` com a rota da API.
2. Altere `modoDemonstracao` para `false`.
3. A API deve aceitar `POST` com JSON e devolver um status HTTP 2xx somente quando a solicitação tiver sido aceita com sucesso. Em erro, devolva status 4xx/5xx. Se a API estiver em outro domínio, configure CORS no servidor.
4. Configure política de privacidade real e links de contato antes de publicar. O texto de autorização do formulário deve ser revisado conforme o tratamento efetivo.

### Contrato JSON sugerido
```json
{
  "nome": "Pessoa de exemplo",
  "empresa": "Empresa de exemplo",
  "email": "pessoa@example.com",
  "telefone": "(11) 99999-9999",
  "servico": "Turismo e viagens",
  "veiculo": "Ônibus",
  "origem": "Cotia / SP",
  "destino": "Local de destino",
  "saida": "2026-11-10T08:00",
  "retorno": "2026-11-10T18:00",
  "passageiros": 35,
  "trajeto": "Ida e volta",
  "observacoes": "Informações do grupo",
  "consentimento": true,
  "fusoHorario": "America/Sao_Paulo"
}
```
Campos opcionais são enviados como strings vazias. Datas representam horário local, acompanhado do fuso do navegador. O backend deve normalizar essas datas antes de gravar. Valide novamente todos os campos no servidor, limite requisições, use consultas parametrizadas e armazene credenciais apenas no backend. O front não acessa o banco diretamente.

Não há backend, autenticação, envio de e-mail nem persistência incluídos. O site não foi publicado.

## Organização do JavaScript
As funções estão separadas por responsabilidade e documentadas com comentários sobre seus casos de uso. `inicializarPagina` registra os eventos; as funções de menu controlam a navegação; `validarDatas` verifica o retorno; `coletarDadosDaCotacao` prepara o JSON; `tratarEnvioDoFormulario` decide entre demonstração e API; `enviarCotacaoParaApi` concentra a requisição e o timeout. `exibirStatus` e `atualizarEstadoDeEnvio` cuidam do feedback visual.
