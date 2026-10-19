const slidesFrota = document.querySelector(".slides-frota");

if (slidesFrota) {
  const mobile = window.matchMedia("(max-width: 900px)");
  const movimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)");
  const total = slidesFrota.querySelectorAll("img").length;
  let temporizador;
  let interagindo = false;

  const agendarTroca = () => {
    clearTimeout(temporizador);
    if (!mobile.matches || movimentoReduzido.matches || document.hidden ||
        interagindo || slidesFrota.contains(document.activeElement) || total < 2) return;

    temporizador = setTimeout(() => {
      if (!slidesFrota.clientWidth) return;
      const atual = Math.round(slidesFrota.scrollLeft / slidesFrota.clientWidth);
      const proximo = (atual + 1) % total;
      slidesFrota.scrollTo({
        left: proximo * slidesFrota.clientWidth,
        behavior: proximo === 0 ? "instant" : "smooth",
      });
      agendarTroca();
    }, 4000);
  };

  slidesFrota.addEventListener("scroll", agendarTroca, { passive: true });
  slidesFrota.addEventListener("pointerdown", () => {
    interagindo = true;
    clearTimeout(temporizador);
  }, { passive: true });
  const finalizarInteracao = () => {
    interagindo = false;
    agendarTroca();
  };
  window.addEventListener("pointerup", finalizarInteracao);
  window.addEventListener("pointercancel", finalizarInteracao);
  slidesFrota.addEventListener("focusin", agendarTroca);
  slidesFrota.addEventListener("focusout", agendarTroca);
  document.addEventListener("visibilitychange", agendarTroca);
  mobile.addEventListener("change", agendarTroca);
  movimentoReduzido.addEventListener("change", agendarTroca);
  agendarTroca();
}
