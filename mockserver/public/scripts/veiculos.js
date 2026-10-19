const modalVeiculo = document.querySelector(".modal-veiculo");
const iframeVeiculo = modalVeiculo?.querySelector("iframe");

if (modalVeiculo && iframeVeiculo && typeof modalVeiculo.showModal === "function") {
  const fechar = () => modalVeiculo.close();

  document.querySelectorAll("[data-veiculo]").forEach((link) => {
    link.addEventListener("click", (evento) => {
      if (evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey) return;
      evento.preventDefault();
      iframeVeiculo.title = `Fotos e informações: ${link.dataset.veiculo}`;
      iframeVeiculo.src = link.href;
      modalVeiculo.showModal();
      document.body.classList.add("modal-veiculo-aberto");
    });
  });

  modalVeiculo.querySelector(".fechar-modal-veiculo").addEventListener("click", fechar);
  modalVeiculo.addEventListener("click", (evento) => {
    if (evento.target !== modalVeiculo) return;
    const limites = modalVeiculo.getBoundingClientRect();
    if (evento.clientX < limites.left || evento.clientX > limites.right ||
        evento.clientY < limites.top || evento.clientY > limites.bottom) fechar();
  });
  iframeVeiculo.addEventListener("load", () => {
    iframeVeiculo.contentDocument?.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape") {
        evento.preventDefault();
        fechar();
      }
    });
  });
  modalVeiculo.addEventListener("close", () => {
    document.body.classList.remove("modal-veiculo-aberto");
    iframeVeiculo.removeAttribute("src");
  });
}
