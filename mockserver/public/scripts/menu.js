if (/^https?:$/.test(window.location.protocol) && window.location.pathname.endsWith("/index.html")) {
  const endereco = new URL(window.location.href);
  endereco.pathname = endereco.pathname.slice(0, -"index.html".length);
  window.history.replaceState(window.history.state, "", endereco.href);
}

document.querySelectorAll(".cabecalho").forEach((cabecalho) => {
  const botaoMenu = cabecalho.querySelector(".botao-menu");
  const navegacao = cabecalho.querySelector(".navegacao-principal");

  if (!botaoMenu || !navegacao) {
    return;
  }

  const fecharMenu = () => {
    botaoMenu.setAttribute("aria-expanded", "false");
    navegacao.classList.remove("aberta");
  };

  botaoMenu.addEventListener("click", () => {
    const estaAberto = botaoMenu.getAttribute("aria-expanded") === "true";
    botaoMenu.setAttribute("aria-expanded", String(!estaAberto));
    navegacao.classList.toggle("aberta", !estaAberto);
  });

  navegacao.addEventListener("click", (evento) => {
    if (evento.target instanceof Element && evento.target.closest("a")) {
      fecharMenu();
    }
  });

  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape") {
      fecharMenu();
    }
  });
});

// Reveal each block once, keeping anchor links and keyboard navigation usable.
if ("IntersectionObserver" in window) {
  const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)");
  const candidatos = [...document.querySelectorAll(
    "main .destaque-inicial, main > header, main section > header, " +
    "main article, main aside, main h1, main h2, main p, " +
    ".titulo-introducao, .texto-orientacao, .detalhes-cotacao"
  )];
  // Animate the containing block instead of hiding its children a second time.
  const elementos = candidatos.filter((elemento) =>
    !candidatos.some((outro) => outro !== elemento && outro.contains(elemento))
  );
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        target.classList.add("visivel");
        observador.unobserve(target);
      }
    });
  }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });

  if (!movimentoReduzido.matches) {
    elementos.forEach((elemento) => {
      elemento.classList.add("revelar-rolagem");
      observador.observe(elemento);
    });
  }

  movimentoReduzido.addEventListener("change", () => {
    if (movimentoReduzido.matches) {
      observador.disconnect();
      elementos.forEach((elemento) => elemento.classList.add("visivel"));
    }
  });
}
