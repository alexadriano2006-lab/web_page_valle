(function (painel) {
  const pagina = {
    chave: "usuarios",
    titulo: "Usuários",
    tituloRegistros: "Usuários cadastrados",
    descricao: "Gerencie as pessoas e os níveis de acesso ao painel.",
    subtitulo: "ADMINISTRAÇÃO",
    botao: "Convidar usuário",
    rotuloBotao: "Convidar usuário",
    busca: "Buscar por nome, e-mail ou perfil...",
    registros: painel.dados.usuarios,
    colunas: painel.componentes.colunas.usuarios,
    cabecalhosCsv: ["Código", "Nome", "E-mail", "Perfil", "Último acesso", "Status"],
    linhaCsv: (usuario) => [usuario.codigo, usuario.nome, usuario.email, usuario.perfil, usuario.ultimoAcesso, usuario.situacao],
    campos: [
      { nome: "nome", rotulo: "Nome completo", obrigatorio: true },
      { nome: "email", rotulo: "E-mail", tipoCampo: "email", obrigatorio: true },
      { nome: "perfil", rotulo: "Perfil de acesso", tipoCampo: "selecao", opcoes: ["Administradora", "Financeiro", "Comercial", "Operações"], obrigatorio: true, larguraCompleta: true },
    ],
    criarRegistro(valores, registros) {
      return {
        ...valores,
        codigo: painel.ferramentas.gerarProximoCodigo(registros, "USR"),
        ultimoAcesso: "Aguardando primeiro acesso",
        situacao: "Convite enviado",
      };
    },
    exibir() {
      painel.componentes.exibirPaginaDeRegistros(pagina);
    },
  };

  painel.paginas.usuarios = pagina;
})(window.PainelValle);
