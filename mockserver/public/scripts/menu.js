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
