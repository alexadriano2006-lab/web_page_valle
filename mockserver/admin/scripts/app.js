(function (painel) {
  const paginaAtual = document.querySelector("#pagina-atual");
  const itensNavegacao = [...document.querySelectorAll("[data-pagina]")];
  const raizModal = document.querySelector("#raiz-modal");
  const aviso = document.querySelector("#aviso");
  let paginaSelecionada = "geral";
  let tempoAviso;
  let focoAnterior;

  function fecharModal() {
    raizModal.innerHTML = "";
    focoAnterior?.focus();
  }

  function exibirAviso(mensagem) {
    aviso.textContent = mensagem;
    aviso.classList.add("is-visible");
    window.clearTimeout(tempoAviso);
    tempoAviso = window.setTimeout(() => aviso.classList.remove("is-visible"), 2800);
  }

  function fecharMenuMovel() {
    document.querySelector("#menu-lateral").classList.remove("is-open");
    document.querySelector("#fundo-menu-lateral").classList.remove("is-visible");
    document.querySelector("#botao-menu-movel").setAttribute("aria-expanded", "false");
  }

  function exibirPagina(chavePagina) {
    paginaSelecionada = Object.hasOwn(painel.paginas, chavePagina) ? chavePagina : "geral";
    const pagina = painel.paginas[paginaSelecionada];
    paginaAtual.textContent = pagina.titulo;

    itensNavegacao.forEach((item) => {
      const estaSelecionado = item.dataset.pagina === paginaSelecionada;
      item.classList.toggle("is-active", estaSelecionado);
      if (estaSelecionado) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });

    const cotacoesEmAberto = painel.dados.cotacoes
      .filter((cotacao) => ["Pendente", "Em análise"].includes(cotacao.situacao)).length;
    document.querySelector(".nav-count").textContent = cotacoesEmAberto;
    pagina.exibir();
    fecharMenuMovel();
  }

  function abrirModal(chavePagina) {
    const pagina = painel.paginas[chavePagina];
    if (!pagina?.campos) return;
    focoAnterior = document.activeElement;

    const campos = pagina.campos.map((campo) => {
      const controle = campo.tipoCampo === "selecao"
        ? `<select id="campo-${campo.nome}" name="${campo.nome}" ${campo.obrigatorio ? "required" : ""}><option value="" disabled selected>Selecione</option>${campo.opcoes.map((opcao) => `<option value="${painel.ferramentas.escaparHtml(opcao)}">${painel.ferramentas.escaparHtml(opcao)}</option>`).join("")}</select>`
        : `<input id="campo-${campo.nome}" name="${campo.nome}" type="${campo.tipoCampo || "text"}" ${campo.tipoCampo === "number" ? 'min="0" step="any"' : ""} ${campo.obrigatorio ? "required" : ""}>`;
      return `<div class="form-field ${campo.larguraCompleta ? "full" : ""}"><label for="campo-${campo.nome}">${campo.rotulo}</label>${controle}</div>`;
    }).join("");

    raizModal.innerHTML = `<div class="modal-backdrop">
      <section class="modal" role="dialog" aria-modal="true" aria-labelledby="titulo-modal">
        <div class="modal-header"><div><h2 id="titulo-modal">${pagina.rotuloBotao}</h2><p>Preencha os dados abaixo para adicionar um registro.</p></div><button class="modal-close" type="button" data-fechar-modal aria-label="Fechar">×</button></div>
        <form id="formulario-registro"><div class="form-grid">${campos}</div>
          <div class="modal-actions"><button class="button-secondary" type="button" data-fechar-modal>Cancelar</button><button class="button-primary" type="submit">Salvar registro</button></div>
        </form>
      </section>
    </div>`;
    raizModal.querySelector("input, select")?.focus();
  }

  function salvarRegistro(formulario) {
    if (!formulario.reportValidity()) return;
    const pagina = painel.paginas[paginaSelecionada];
    const valores = Object.fromEntries(new FormData(formulario).entries());
    pagina.registros.unshift(pagina.criarRegistro(valores, pagina.registros));
    fecharModal();
    exibirPagina(paginaSelecionada);
    exibirAviso("Registro adicionado. Os dados ficam disponíveis apenas nesta sessão.");
  }

  function exportarRegistros(chavePagina) {
    const pagina = painel.paginas[chavePagina === "geral" ? "cotacoes" : chavePagina];
    if (!pagina?.cabecalhosCsv || !pagina.linhaCsv) return;

    const linhas = pagina.registros.map(pagina.linhaCsv);
    const conteudoCsv = [pagina.cabecalhosCsv, ...linhas]
      .map((linha) => linha.map((valor) => `"${String(valor).replaceAll('"', '""')}"`).join(";"))
      .join("\r\n");
    const arquivo = new Blob(["\uFEFF", conteudoCsv], { type: "text/csv;charset=utf-8" });
    const enderecoArquivo = URL.createObjectURL(arquivo);
    const elo = document.createElement("a");
    elo.href = enderecoArquivo;
    elo.download = `valle-${chavePagina}-demonstrativo.csv`;
    document.body.append(elo);
    elo.click();
    elo.remove();
    URL.revokeObjectURL(enderecoArquivo);
    exibirAviso("Arquivo demonstrativo exportado em CSV.");
  }

  document.addEventListener("click", (evento) => {
    const elemento = evento.target instanceof Element ? evento.target : null;
    if (!elemento) return;

    const navegacao = elemento.closest("[data-pagina], [data-navegar]");
    if (navegacao) {
      const chavePagina = navegacao.dataset.pagina || navegacao.dataset.navegar;
      if (window.location.hash === `#${chavePagina}`) exibirPagina(chavePagina);
      else window.location.hash = chavePagina;
      return;
    }

    const botaoAdicionar = elemento.closest("[data-adicionar]");
    if (botaoAdicionar) {
      abrirModal(botaoAdicionar.dataset.adicionar);
      return;
    }

    const botaoExportar = elemento.closest("[data-exportar]");
    if (botaoExportar) {
      exportarRegistros(botaoExportar.dataset.exportar);
      return;
    }

    if (elemento.closest("[data-fechar-modal]") || elemento.classList.contains("modal-backdrop")) {
      fecharModal();
      return;
    }

    const botaoAviso = elemento.closest("[data-aviso]");
    if (botaoAviso) exibirAviso(botaoAviso.dataset.aviso);
  });

  document.addEventListener("submit", (evento) => {
    if (evento.target instanceof HTMLFormElement && evento.target.id === "formulario-registro") {
      evento.preventDefault();
      salvarRegistro(evento.target);
    }
  });

  document.querySelector("#botao-menu-movel").addEventListener("click", (evento) => {
    const menuLateral = document.querySelector("#menu-lateral");
    const estaAberto = menuLateral.classList.toggle("is-open");
    document.querySelector("#fundo-menu-lateral").classList.toggle("is-visible", estaAberto);
    evento.currentTarget.setAttribute("aria-expanded", String(estaAberto));
  });

  document.querySelector("#fundo-menu-lateral").addEventListener("click", fecharMenuMovel);
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
      if (raizModal.firstElementChild) fecharModal();
      fecharMenuMovel();
    }
  });
  window.addEventListener("hashchange", () => exibirPagina(window.location.hash.slice(1) || "geral"));
  exibirPagina(window.location.hash.slice(1) || "geral");
})(window.PainelValle);
