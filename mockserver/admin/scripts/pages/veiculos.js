(function (painel) {
  const pagina = {
    chave: "veiculos",
    titulo: "Veículos",
    tituloRegistros: "Veículos cadastrados",
    descricao: "Visualize a frota e acompanhe a disponibilidade dos veículos.",
    subtitulo: "OPERAÇÕES",
    botao: "Adicionar veículo",
    rotuloBotao: "Adicionar veículo",
    busca: "Buscar por veículo, placa ou categoria...",
    registros: painel.dados.veiculos,
    colunas: painel.componentes.colunas.veiculos,
    cabecalhosCsv: ["Código", "Veículo", "Placa", "Categoria", "Capacidade", "Ano", "Status"],
    linhaCsv: (veiculo) => [veiculo.codigo, veiculo.nome, veiculo.placa, veiculo.tipo, veiculo.capacidade, veiculo.ano, veiculo.situacao],
    campos: [
      { nome: "nome", rotulo: "Modelo do veículo", obrigatorio: true },
      { nome: "placa", rotulo: "Placa", obrigatorio: true },
      { nome: "tipo", rotulo: "Categoria", tipoCampo: "selecao", opcoes: ["Micro-ônibus", "Ônibus", "Van"], obrigatorio: true },
      { nome: "capacidade", rotulo: "Capacidade de passageiros", tipoCampo: "number", obrigatorio: true },
      { nome: "ano", rotulo: "Ano", tipoCampo: "number", obrigatorio: true },
    ],
    criarRegistro(valores, registros) {
      return {
        codigo: painel.ferramentas.gerarProximoCodigo(registros, "VLL"),
        ...valores,
        capacidade: Number(valores.capacidade),
        ano: Number(valores.ano),
        situacao: "Disponível",
      };
    },
    exibir() {
      painel.componentes.exibirPaginaDeRegistros(pagina);
    },
  };

  painel.paginas.veiculos = pagina;
})(window.PainelValle);
