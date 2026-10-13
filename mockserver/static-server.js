import express from "express";
import { fileURLToPath } from "node:url";

export function criarAplicacao(pasta) {
  const app = express();
  app.disable("x-powered-by");
  if (pasta === "public") {
    app.get(["/paginas/servicos", "/pagninas/servicos", "/pagninas/servicos.html"], (_req, res) => {
      res.redirect(302, "/paginas/servicos.html");
    });
  }
  app.use(express.static(fileURLToPath(new URL(`./${pasta}/`, import.meta.url))));
  return app;
}

export function iniciarServidor(pasta, porta) {
  return criarAplicacao(pasta).listen(porta, "127.0.0.1", () => {
    console.log(`Servidor em execução: http://127.0.0.1:${porta}/`);
  });
}
