(function (painel) {
  const { formatarMoeda } = painel.ferramentas;
  const { criarCabecalhoPagina, criarCartaoIndicador, criarTabela, colunas } = painel.componentes;
  const { cotacoes, veiculos, usuarios } = painel.dados;

  function exibir() {
    const cotacoesEmAberto = cotacoes.filter((cotacao) => ["Pendente", "Em análise"].includes(cotacao.situacao)).length;
    const veiculosEmOperacao = veiculos.filter((veiculo) => veiculo.situacao === "Em operação").length;
    const usuariosAtivos = usuarios.filter((usuario) => usuario.situacao === "Ativo").length;
    const statusCotacoes = [
      { rotulo: "Aprovadas", quantidade: cotacoes.filter((cotacao) => cotacao.situacao === "Aprovada").length, icone: "" },
      { rotulo: "Em andamento", quantidade: cotacoesEmAberto, icone: "pending" },
      { rotulo: "Concluídas", quantidade: cotacoes.filter((cotacao) => cotacao.situacao === "Concluída").length, icone: "closed" },
    ];
    const totalCotacoes = cotacoes.length || 1;
    const acoes = `<span class="demo-badge"><span></span>Resumo demonstrativo · Outubro 2026</span><button class="button-secondary" type="button" data-exportar="geral"><span class="button-icon" aria-hidden="true">↓</span>Exportar resumo</button>`;
    const conteudo = document.querySelector("#conteudo-pagina");

    conteudo.innerHTML = `
      ${criarCabecalhoPagina("PAINEL DEMONSTRATIVO", "Bom dia, usuário demo 👋", "Aqui está uma visão ilustrativa da operação em desenvolvimento.", acoes)}
      <section class="metric-grid" aria-label="Indicadores principais">
        ${criarCartaoIndicador("Cotações em aberto", cotacoesEmAberto, "▤", "orange", `${cotacoes.length} solicitações no total`, "↗ 12%")}
        ${criarCartaoIndicador("Veículos em operação", `${veiculosEmOperacao}<span class="metric-change">/ ${veiculos.length}</span>`, "▰", "green", "da frota cadastrada")}
        ${criarCartaoIndicador("Receita no mês", formatarMoeda(48290), "↗", "blue", "Outubro de 2026", "↗ 8,4%")}
        ${criarCartaoIndicador("Usuários ativos", usuariosAtivos, "♙", "red", "com acesso ao painel")}
      </section>
      <section class="dashboard-grid" aria-label="Visão geral da operação">
        <article class="panel">
          <div class="panel-heading">
            <div><h2>Receita ao longo do tempo</h2><p>Desempenho mensal · 2026</p></div>
            <span class="legend"><i></i> Receita</span>
          </div>
          <div class="chart-wrap">
            <svg viewBox="0 0 600 190" role="img" aria-label="Gráfico demonstrativo de receita mensal de janeiro a outubro de 2026">
              <defs><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#16745d" stop-opacity=".16"/><stop offset="100%" stop-color="#16745d" stop-opacity="0"/></linearGradient></defs>
              <line class="chart-grid-line" x1="40" y1="20" x2="590" y2="20"/><line class="chart-grid-line" x1="40" y1="64" x2="590" y2="64"/>
              <line class="chart-grid-line" x1="40" y1="108" x2="590" y2="108"/><line class="chart-grid-line" x1="40" y1="152" x2="590" y2="152"/>
              <text class="chart-label" x="0" y="23">60 mil</text><text class="chart-label" x="0" y="67">40 mil</text>
              <text class="chart-label" x="0" y="111">20 mil</text><text class="chart-label" x="18" y="155">0</text>
              <path class="chart-area" d="M50 118 L108 105 L166 112 L224 86 L282 92 L340 68 L398 78 L456 52 L514 59 L572 32 L572 152 L50 152 Z"/>
              <path class="chart-line" d="M50 118 L108 105 L166 112 L224 86 L282 92 L340 68 L398 78 L456 52 L514 59 L572 32"/>
              <circle class="chart-dot" cx="572" cy="32" r="4"/>
              <text class="chart-label" x="45" y="174">Jan</text><text class="chart-label" x="103" y="174">Fev</text>
              <text class="chart-label" x="161" y="174">Mar</text><text class="chart-label" x="219" y="174">Abr</text>
              <text class="chart-label" x="277" y="174">Mai</text><text class="chart-label" x="335" y="174">Jun</text>
              <text class="chart-label" x="393" y="174">Jul</text><text class="chart-label" x="451" y="174">Ago</text>
              <text class="chart-label" x="509" y="174">Set</text><text class="chart-label" x="567" y="174">Out</text>
            </svg>
          </div>
        </article>
        <article class="panel">
          <div class="panel-heading"><div><h2>Status das cotações</h2><p>Distribuição das solicitações</p></div><button class="panel-link" type="button" data-navegar="cotacoes">Ver cotações →</button></div>
          <div class="status-list">${statusCotacoes.map((item) => `
            <div class="status-row">
              <span class="status-label"><i class="${item.icone}"></i>${item.rotulo}</span><span class="status-count">${item.quantidade}</span>
              <span class="status-track"><span style="width:${Math.max(6, (item.quantidade / totalCotacoes) * 100)}%"></span></span>
            </div>`).join("")}
          </div>
        </article>
      </section>
      <section class="panel table-panel">
        <div class="panel-heading"><div><h2>Cotações recentes</h2><p>Últimas solicitações recebidas pela equipe.</p></div><button class="panel-link" type="button" data-navegar="cotacoes">Ver todas →</button></div>
        <div class="table-wrap">${criarTabela(colunas.cotacoes, cotacoes.slice(0, 4))}</div>
      </section>`;
  }

  painel.paginas.geral = { titulo: "Geral", exibir };
})(window.PainelValle);
