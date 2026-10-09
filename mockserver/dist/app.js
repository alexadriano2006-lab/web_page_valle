'use strict';

/* ==========================================================
   CONFIGURAÇÃO GERAL E ELEMENTOS DA PÁGINA
   - Define o comportamento da demonstração
   - Centraliza os endpoints e seletores do DOM
   ========================================================== */

// A demonstração valida os campos, mas não envia nem persiste dados.
// Para integrar à API real, basta trocar o endpoint e deixar modoDemonstracao em false.
const configuracao = Object.freeze({
  modoDemonstracao: true,
  endpointCotacao: '/api/cotacoes',
  tempoLimiteEmMilissegundos: 15000,
});

const elementos = {
  formulario: document.querySelector('#form-cotacao'),
  status: document.querySelector('#form-status'),
  menu: document.querySelector('#navegacao'),
  botaoMenu: document.querySelector('.menu-toggle'),
  ano: document.querySelector('#ano'),
  avisoDemonstracao: document.querySelector('.demo-note'),
};

elementos.botaoEnviar = elementos.formulario.querySelector('[type="submit"]');

/* ==========================================================
   NAVEGAÇÃO MOBILE
   - Abre e fecha o menu em telas menores
   - Atualiza a acessibilidade com aria-expanded
   ========================================================== */

/**
 * Alterna a navegação em telas menores.
 * Quando o menu está fechado, ele abre e atualiza o aria-expanded para refletir o estado visual.
 */
function alternarMenu() {
  const deveAbrir = elementos.botaoMenu.getAttribute('aria-expanded') !== 'true';

  elementos.botaoMenu.setAttribute('aria-expanded', String(deveAbrir));
  elementos.menu.classList.toggle('open', deveAbrir);
}

/**
 * Fecha a navegação e atualiza o estado de acessibilidade.
 * Essa função continua segura mesmo quando o menu já está fechado.
 */
function fecharMenu() {
  elementos.menu.classList.remove('open');
  elementos.botaoMenu.setAttribute('aria-expanded', 'false');
}

/**
 * Fecha o menu quando o usuário clica em um link interno.
 * A navegação não muda de estado quando o clique acontece em áreas vazias da barra.
 */
function tratarCliqueNaNavegacao(evento) {
  if (evento.target.closest('a')) {
    fecharMenu();
  }
}

/**
 * Preenche o campo do serviço após o clique em um card de oferta.
 * O valor é enviado junto com o restante do formulário na submissão final.
 */
function selecionarServico(evento) {
  elementos.formulario.elements.servico.value = evento.currentTarget.dataset.servico;
}

/* ==========================================================
   VALIDAÇÃO DO FORMULÁRIO
   - Verifica a consistência de datas
   - Coleta e prepara os dados para envio
   ========================================================== */

/**
 * Valida a sequência das datas de saída e retorno.
 * Se o retorno ocorrer antes da saída, o navegador mostra uma mensagem de erro nativa.
 */
function validarDatas() {
  const { saida, retorno } = elementos.formulario.elements;
  const retornoAnterior = Boolean(retorno.value) && retorno.value < saida.value;

  retorno.setCustomValidity(
    retornoAnterior ? 'O retorno deve ocorrer após a saída.' : '',
  );
}

/**
 * Coleta os dados do formulário, normaliza strings e ajusta os tipos necessários para o JSON.
 * Campos vazios continuam vazios; passageiros vira número e consentimento vira boolean.
 */
function coletarDadosDaCotacao() {
  const dados = Object.fromEntries(new FormData(elementos.formulario));

  for (const chave of Object.keys(dados)) {
    dados[chave] = typeof dados[chave] === 'string' ? dados[chave].trim() : dados[chave];
  }

  dados.passageiros = Number(dados.passageiros);
  dados.consentimento = dados.consentimento === 'on' || dados.consentimento === 'true';
  dados.fusoHorario = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return dados;
}

/* ==========================================================
   FEEDBACK E ENVIO
   - Mostra mensagens de status
   - Envia os dados com timeout e trata falhas
   ========================================================== */

/**
 * Exibe mensagens de feedback sem inserir HTML bruto no DOM.
 * Mensagens vazias ocultam o bloco via CSS, e o tipo controla a cor da notificação.
 */
function exibirStatus(mensagem, tipo = '') {
  elementos.status.textContent = mensagem;
  elementos.status.className = `form-status ${tipo}`;
}

/**
 * Atualiza o estado visual do botão de envio.
 * Em submissão, o botão fica bloqueado para evitar clique duplo; no fim, restaura o rótulo do modo atual.
 */
function atualizarEstadoDeEnvio(enviando) {
  elementos.botaoEnviar.disabled = enviando;
  elementos.botaoEnviar.textContent = enviando
    ? 'Enviando…'
    : configuracao.modoDemonstracao
      ? 'Preparar solicitação ↗'
      : 'Enviar solicitação ↗';
}

/**
 * Envia a cotação para a API usando POST com timeout.
 * Em caso de 4xx/5xx, falha de rede ou aborto por timeout, a função lança erro para o chamador tratar.
 */
async function enviarCotacaoParaApi(dados) {
  const controlador = new AbortController();
  const tempoLimite = setTimeout(
    () => controlador.abort(),
    configuracao.tempoLimiteEmMilissegundos,
  );

  try {
    const resposta = await fetch(configuracao.endpointCotacao, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(dados),
      signal: controlador.signal,
    });

    if (!resposta.ok) {
      throw new Error('Resposta inválida da API');
    }
  } finally {
    clearTimeout(tempoLimite);
  }
}

/**
 * Controla a submissão do formulário em todos os cenários:
 * 1) campos inválidos: bloqueia e mostra erro nativo;
 * 2) modo demonstração: valida sem enviar dados;
 * 3) sucesso na API: confirma e limpa o formulário;
 * 4) falha/timeout: mantém o conteúdo para nova tentativa.
 */
async function tratarEnvioDoFormulario(evento) {
  evento.preventDefault();
  validarDatas();

  if (!elementos.formulario.reportValidity()) {
    return;
  }

  const dados = coletarDadosDaCotacao();

  if (configuracao.modoDemonstracao) {
    exibirStatus(
      'Dados validados! Esta é uma demonstração: a solicitação não foi enviada nem armazenada.',
      'success',
    );
    return;
  }

  atualizarEstadoDeEnvio(true);
  exibirStatus('');

  try {
    await enviarCotacaoParaApi(dados);
    exibirStatus(
      'Solicitação enviada com sucesso! A equipe entrará em contato para alinhar os detalhes.',
      'success',
    );
    elementos.formulario.reset();
  } catch {
    exibirStatus(
      'Não foi possível confirmar o envio. Seus dados continuam no formulário. Tente novamente mais tarde.',
      'error',
    );
  } finally {
    atualizarEstadoDeEnvio(false);
  }
}

/* ==========================================================
   INICIALIZAÇÃO
   - Registra eventos do botão, menu e formulário
   - Define o estado inicial da página
   ========================================================== */

/**
 * Inicializa a página e registra todos os listeners necessários.
 * Essa função centraliza a montagem do comportamento once e evita listeners duplicados em inicializações repetidas.
 */
function inicializarPagina() {
  elementos.ano.textContent = new Date().getFullYear();
  elementos.botaoMenu.addEventListener('click', alternarMenu);
  elementos.menu.addEventListener('click', tratarCliqueNaNavegacao);
  elementos.formulario.addEventListener('submit', tratarEnvioDoFormulario);

  for (const link of document.querySelectorAll('[data-servico]')) {
    link.addEventListener('click', selecionarServico);
  }

  for (const nome of ['saida', 'retorno']) {
    elementos.formulario.elements[nome].addEventListener('input', validarDatas);
  }

  atualizarEstadoDeEnvio(false);

  if (!configuracao.modoDemonstracao) {
    elementos.avisoDemonstracao.textContent =
      'Os dados serão usados para atender sua solicitação de cotação.';
  }
}

inicializarPagina();
