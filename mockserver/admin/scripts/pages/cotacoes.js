(function (painel) {
  const pagina = {
    chave: "cotacoes",
    titulo: "Cotações",
    tituloRegistros: "Cotações cadastradas",
    descricao: "Acompanhe solicitações e oportunidades comerciais.",
    subtitulo: "COMERCIAL",
    botao: "Nova cotação",
    rotuloBotao: "Adicionar cotação",
    busca: "Buscar por cliente, serviço ou código...",
    registros: painel.dados.cotacoes,
    colunas: painel.componentes.colunas.cotacoes,
    cabecalhosCsv: ["Código", "Cliente", "Serviço", "Solicitada em", "Valor estimado", "Status"],
    linhaCsv: (cotacao) => [cotacao.codigo, cotacao.cliente, cotacao.servico, cotacao.data, painel.ferramentas.formatarMoeda(cotacao.valor), cotacao.situacao],
    campos: [
      { nome: "cliente", rotulo: "Nome do cliente", obrigatorio: true },
      { nome: "email", rotulo: "E-mail", tipoCampo: "email", obrigatorio: true },
      { nome: "servico", rotulo: "Tipo de serviço", tipoCampo: "selecao", opcoes: ["Fretamento", "Transporte escolar", "Viagem pedagógica"], obrigatorio: true },
      { nome: "data", rotulo: "Data da solicitação", tipoCampo: "date", obrigatorio: true },
      { nome: "valor", rotulo: "Valor estimado (R$)", tipoCampo: "number", obrigatorio: true },
    ],
    criarRegistro(valores, registros) {
      return {
        codigo: painel.ferramentas.gerarProximoCodigo(registros, "COT"),
        ...valores,
        data: painel.ferramentas.formatarData(valores.data),
        valor: Number(valores.valor),
        situacao: "Pendente",
      };
    },
    exibir() {
      painel.componentes.exibirPaginaDeRegistros(pagina);
    },
  };

  painel.paginas.cotacoes = pagina;
})(window.PainelValle);
