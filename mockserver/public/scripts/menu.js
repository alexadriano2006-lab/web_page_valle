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

const secaoDestaque = document.querySelector(".destaque-inicial");
if (secaoDestaque) {
  const slides = [...secaoDestaque.querySelectorAll(".slide")];
  const botoesSlide = [...secaoDestaque.querySelectorAll("[data-slide]")];
  const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)");
  let indiceAtual = 0;
  let temporizador;

  const mostrarSlide = (indice) => {
    indiceAtual = (indice + slides.length) % slides.length;

    slides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === indiceAtual);
    });

  };

  const avancarSlide = (passo = 1) => {
    mostrarSlide(indiceAtual + passo);
  };

  const reiniciarAutoPlay = () => {
    window.clearInterval(temporizador);
    if (slides.length < 2 || movimentoReduzido.matches || document.hidden || secaoDestaque.matches(":hover, :focus-within")) return;
    temporizador = window.setInterval(avancarSlide, 5000);
  };

  movimentoReduzido.addEventListener("change", reiniciarAutoPlay);

  secaoDestaque.addEventListener("mouseenter", reiniciarAutoPlay);
  secaoDestaque.addEventListener("mouseleave", reiniciarAutoPlay);
  secaoDestaque.addEventListener("focusin", reiniciarAutoPlay);
  secaoDestaque.addEventListener("focusout", () => window.setTimeout(reiniciarAutoPlay, 0));
  document.addEventListener("visibilitychange", reiniciarAutoPlay);

  botoesSlide.forEach((botao) => {
    botao.addEventListener("click", () => {
      const direcao = botao.dataset.slide === "next" ? 1 : -1;
      avancarSlide(direcao);
      reiniciarAutoPlay();
    });
  });

  if (slides.length) mostrarSlide(0);
  reiniciarAutoPlay();
}
