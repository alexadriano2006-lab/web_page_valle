(function (painel) {
  const { formatarMoeda } = painel.ferramentas;
  const { criarCartaoIndicador } = painel.componentes;

  const pagina = {
    chave: "financas",
    titulo: "Finanças",
    tituloRegistros: "Lançamentos financeiros",
    descricao: "Consulte receitas, despesas e lançamentos financeiros.",
    subtitulo: "FINANCEIRO",
    botao: "Novo lançamento",
    rotuloBotao: "Adicionar lançamento",
    busca: "Buscar por descrição, categoria ou código...",
    registros: painel.dados.financas,
    colunas: painel.componentes.colunas.financas,
    cabecalhosCsv: ["Código", "Data", "Descrição", "Categoria", "Valor", "Status"],
    linhaCsv: (lancamento) => [lancamento.codigo, lancamento.data, lancamento.descricao, lancamento.categoria, formatarMoeda(lancamento.valor), lancamento.situacao],
    campos: [
      { nome: "descricao", rotulo: "Descrição", obrigatorio: true, larguraCompleta: true },
      { nome: "categoria", rotulo: "Categoria", tipoCampo: "selecao", opcoes: ["Receita", "Despesa"], obrigatorio: true },
      { nome: "valor", rotulo: "Valor (R$)", tipoCampo: "number", obrigatorio: true },
      { nome: "data", rotulo: "Data", tipoCampo: "date", obrigatorio: true },
    ],
    criarRegistro(valores, registros) {
      const valor = Number(valores.valor) * (valores.categoria === "Despesa" ? -1 : 1);
      return {
        codigo: painel.ferramentas.gerarProximoCodigo(registros, "FIN"),
        ...valores,
        valor,
        data: painel.ferramentas.formatarData(valores.data),
        situacao: valores.categoria === "Receita" ? "A receber" : "Pago",
      };
    },
    exibirResumo(registros) {
      const receitas = registros.filter((lancamento) => lancamento.valor > 0).reduce((total, lancamento) => total + lancamento.valor, 0);
      const despesas = Math.abs(registros.filter((lancamento) => lancamento.valor < 0).reduce((total, lancamento) => total + lancamento.valor, 0));
      return `<section class="finance-summary" aria-label="Resumo financeiro">
        ${criarCartaoIndicador("Receitas registradas", formatarMoeda(receitas), "↗", "green", "Lançamentos demonstrativos")}
        ${criarCartaoIndicador("Despesas registradas", formatarMoeda(despesas), "↘", "orange", "Lançamentos demonstrativos")}
        ${criarCartaoIndicador("Saldo dos lançamentos", formatarMoeda(receitas - despesas), "◎", "blue", "Receitas menos despesas")}
      </section>`;
    },
    exibir() {
      painel.componentes.exibirPaginaDeRegistros(pagina);
    },
  };

  painel.paginas.financas = pagina;
})(window.PainelValle);
