(function (painel) {
  painel.ferramentas = {
    formatarMoeda(valor) {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(valor);
    },

    escaparHtml(valor) {
      return String(valor).replace(/[&<>"']/g, (caractere) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[caractere]));
    },

    formatarData(valor) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return valor;
      const [ano, mes, dia] = valor.split("-");
      return `${dia}/${mes}/${ano}`;
    },

    gerarProximoCodigo(registros, prefixo) {
      const sufixos = registros
        .map((registro) => registro.codigo.match(/\d+$/)?.[0])
        .filter(Boolean);
      const largura = Math.max(3, ...sufixos.map((sufixo) => sufixo.length));
      const proximoNumero = Math.max(0, ...sufixos.map(Number)) + 1;
      return `${prefixo}-${String(proximoNumero).padStart(largura, "0")}`;
    },

    obterTomStatus(situacao) {
      const normalizado = situacao.toLocaleLowerCase("pt-BR");
      if (normalizado.includes("análise")) return "review";
      if (normalizado.includes("pendente") || normalizado.includes("receber") || normalizado.includes("convite")) return "pending";
      if (normalizado.includes("manutenção") || normalizado.includes("atrasado")) return "canceled";
      if (normalizado.includes("inativo")) return "closed";
      if (normalizado.includes("concluída") || normalizado.includes("pago") || normalizado.includes("aprovada")) return "closed";
      return "";
    },

    obterIniciais(nome) {
      return nome.split(/\s+/).slice(0, 2).map((parte) => parte[0]).join("").toLocaleUpperCase("pt-BR");
    },
  };
})(window.PainelValle);
