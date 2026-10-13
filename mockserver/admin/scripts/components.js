(function (painel) {
  const { formatarMoeda, escaparHtml, obterTomStatus, obterIniciais } = painel.ferramentas;

  const colunas = {
    cotacoes: [
      { titulo: "Código", exibir: (cotacao) => escaparHtml(cotacao.codigo) },
      { titulo: "Cliente", exibir: (cotacao) => `<span class="table-main">${escaparHtml(cotacao.cliente)}</span><span class="table-sub">${escaparHtml(cotacao.email)}</span>` },
      { titulo: "Serviço", exibir: (cotacao) => escaparHtml(cotacao.servico) },
      { titulo: "Solicitada em", exibir: (cotacao) => escaparHtml(cotacao.data) },
      { titulo: "Valor estimado", exibir: (cotacao) => `<span class="currency">${formatarMoeda(cotacao.valor)}</span>` },
      { titulo: "Status", exibir: (cotacao) => criarSeloStatus(cotacao.situacao) },
    ],
    veiculos: [
      { titulo: "Veículo", exibir: (veiculo) => `<span class="table-main">${escaparHtml(veiculo.nome)}</span><span class="table-sub">${escaparHtml(veiculo.codigo)} · ${escaparHtml(veiculo.placa)}</span>` },
      { titulo: "Categoria", exibir: (veiculo) => escaparHtml(veiculo.tipo) },
      { titulo: "Capacidade", exibir: (veiculo) => `${escaparHtml(veiculo.capacidade)} passageiros` },
      { titulo: "Ano", exibir: (veiculo) => escaparHtml(veiculo.ano) },
      { titulo: "Status", exibir: (veiculo) => criarSeloStatus(veiculo.situacao) },
    ],
    financas: [
      { titulo: "Lançamento", exibir: (lancamento) => `<span class="table-main">${escaparHtml(lancamento.descricao)}</span><span class="table-sub">${escaparHtml(lancamento.codigo)} · ${escaparHtml(lancamento.data)}</span>` },
      { titulo: "Categoria", exibir: (lancamento) => escaparHtml(lancamento.categoria) },
      { titulo: "Valor", exibir: (lancamento) => `<span class="currency">${formatarMoeda(lancamento.valor)}</span>` },
      { titulo: "Status", exibir: (lancamento) => criarSeloStatus(lancamento.situacao) },
    ],
    usuarios: [
      { titulo: "Usuário", exibir: (usuario) => `<span class="user-cell"><span class="avatar">${escaparHtml(obterIniciais(usuario.nome))}</span><span><span class="table-main">${escaparHtml(usuario.nome)}</span><span class="table-sub">${escaparHtml(usuario.email)}</span></span></span>` },
      { titulo: "Perfil", exibir: (usuario) => escaparHtml(usuario.perfil) },
      { titulo: "Último acesso", exibir: (usuario) => escaparHtml(usuario.ultimoAcesso) },
      { titulo: "Status", exibir: (usuario) => criarSeloStatus(usuario.situacao) },
    ],
  };

  function criarSeloStatus(situacao) {
    return `<span class="status-pill ${obterTomStatus(situacao)}">${escaparHtml(situacao)}</span>`;
  }

  function criarCabecalhoPagina(subtitulo, titulo, descricao, acoes = "") {
    return `
      <div class="page-heading">
        <div>
          <p class="eyebrow">${subtitulo}</p>
          <h1>${titulo}</h1>
          <p>${descricao}</p>
        </div>
        ${acoes ? `<div class="heading-actions">${acoes}</div>` : ""}
      </div>`;
  }

  function criarCartaoIndicador(rotulo, valor, icone, tom, observacao, variacao = "") {
    return `
      <article class="metric-card">
        <div class="metric-top"><span>${rotulo}</span><span class="metric-icon ${tom}" aria-hidden="true">${icone}</span></div>
        <div class="metric-value">${valor}${variacao ? `<span class="metric-change">${variacao}</span>` : ""}</div>
        <p class="metric-note">${observacao}</p>
      </article>`;
  }

  function criarTabela(colunasTabela, registros) {
    return `
      <table>
        <thead><tr>${colunasTabela.map((coluna) => `<th scope="col">${coluna.titulo}</th>`).join("")}</tr></thead>
        <tbody>${registros.map((registro) => `<tr>${colunasTabela.map((coluna) => `<td>${coluna.exibir(registro)}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>`;
  }

  function exibirPaginaDeRegistros(configuracao) {
    const { registros } = configuracao;
    const barraFerramentas = `<div class="toolbar">
        <label class="search-box"><span aria-hidden="true">⌕</span><input type="search" id="busca-registros" placeholder="${configuracao.busca}" aria-label="${configuracao.busca}"></label>
        <div class="toolbar-actions">
          <select class="select-control" id="filtro-situacao" aria-label="Filtrar por status"><option value="">Todos os status</option></select>
          <button class="button-secondary" type="button" data-exportar="${configuracao.chave}"><span class="button-icon" aria-hidden="true">↓</span>Exportar</button>
        </div>
      </div>`;
    const botaoAdicionar = `<button class="button-primary" type="button" data-adicionar="${configuracao.chave}"><span class="button-icon" aria-hidden="true">＋</span>${configuracao.botao}</button>`;
    const resumo = configuracao.exibirResumo ? configuracao.exibirResumo(registros) : "";

    document.querySelector("#conteudo-pagina").innerHTML = `
      ${criarCabecalhoPagina(configuracao.subtitulo, configuracao.titulo, configuracao.descricao, botaoAdicionar)}
      ${resumo}
      ${barraFerramentas}
      <section class="panel table-panel" aria-label="Lista de ${configuracao.titulo.toLocaleLowerCase("pt-BR")}">
        <div class="panel-heading"><div><h2>${configuracao.tituloRegistros}</h2><p id="descricao-tabela">${registros.length} registros encontrados.</p></div></div>
        <div class="table-wrap" id="tabela-registros">${criarTabela(configuracao.colunas, registros)}</div>
      </section>`;

    const campoBusca = document.querySelector("#busca-registros");
    const filtroSituacao = document.querySelector("#filtro-situacao");
    [...new Set(registros.map((registro) => registro.situacao))].forEach((situacao) => {
      const opcao = document.createElement("option");
      opcao.value = situacao;
      opcao.textContent = situacao;
      filtroSituacao.append(opcao);
    });

    const atualizarTabela = () => {
      const busca = campoBusca.value.trim().toLocaleLowerCase("pt-BR");
      const situacaoSelecionada = filtroSituacao.value;
      const registrosFiltrados = registros.filter((registro) => {
        const correspondeBusca = Object.values(registro).some((valor) => String(valor).toLocaleLowerCase("pt-BR").includes(busca));
        return correspondeBusca && (!situacaoSelecionada || registro.situacao === situacaoSelecionada);
      });
      document.querySelector("#tabela-registros").innerHTML = registrosFiltrados.length
        ? criarTabela(configuracao.colunas, registrosFiltrados)
        : `<p class="empty-state">Nenhum registro encontrado. Tente outros termos ou filtros.</p>`;
      document.querySelector("#descricao-tabela").textContent = `${registrosFiltrados.length} de ${registros.length} registros encontrados.`;
    };

    campoBusca.addEventListener("input", atualizarTabela);
    filtroSituacao.addEventListener("change", atualizarTabela);
  }

  painel.componentes = {
    criarCabecalhoPagina,
    criarCartaoIndicador,
    criarTabela,
    colunas,
    exibirPaginaDeRegistros,
  };
})(window.PainelValle);
