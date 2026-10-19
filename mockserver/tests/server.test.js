import assert from "node:assert/strict";
import { once } from "node:events";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { criarAplicacao } from "../static-server.js";

test("Páginas antigas redirecionam preservando o prefixo, parâmetros e âncoras", async () => {
  for (const [arquivo, destino] of [["sobre-valle", "sobre"], ["servicos", "servicos"], ["veiculos", "veiculos"]]) {
    const html = await readFile(new URL(`../public/paginas/${arquivo}.html`, import.meta.url), "utf8");
    const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
    for (const prefixo of ["/", "/web_page_valle/"]) {
      const location = new URL(`https://example.com${prefixo}paginas/${arquivo}.html?origem=menu#conteudo`);
      let endereco;
      location.replace = (url) => { endereco = url; };
      runInNewContext(script, { URL, window: { location } });
      assert.equal(endereco, `https://example.com${prefixo}${destino}/?origem=menu#conteudo`);
    }
  }
});

test("Endereços alternativos de Serviços redirecionam para a página correta", async (t) => {
  const server = criarAplicacao("public").listen(0, "127.0.0.1");
  t.after(() => new Promise((resolve) => server.close(resolve)));
  await once(server, "listening");
  const endereco = `http://127.0.0.1:${server.address().port}`;

  for (const caminho of ["/paginas/servicos", "/pagninas/servicos", "/pagninas/servicos.html"]) {
    const redirecionamento = await fetch(`${endereco}${caminho}`, { redirect: "manual" });
    assert.equal(redirecionamento.status, 302);
    assert.equal(redirecionamento.headers.get("location"), "/servicos/");
    await redirecionamento.text();

    const pagina = await fetch(`${endereco}${caminho}`);
    assert.equal(pagina.status, 200);
    assert.equal(pagina.url, `${endereco}/servicos/`);
    assert.match(await pagina.text(), /<title>Serviços \| Valle Viação<\/title>/);
  }
});

for (const pasta of ["public", "admin"]) {
  test(`Servidor ${pasta} entrega páginas e arquivos estáticos`, async (t) => {
    const server = criarAplicacao(pasta).listen(0, "127.0.0.1");
    t.after(() => new Promise((resolve) => server.close(resolve)));
    await once(server, "listening");
    const endereco = `http://127.0.0.1:${server.address().port}`;
    const pagina = await fetch(endereco);
    assert.equal(pagina.status, 200);
    assert.match(pagina.headers.get("content-type"), /text\/html/);
    const html = await pagina.text();
    assert.match(html, /<!doctype html>/i);
    if (pasta === "public") assert.match(html, /datetime="1986">1986/);

    const raiz = new URL(`../${pasta}/`, import.meta.url);
    const arquivosHtml = (await readdir(raiz, { recursive: true })).filter((arquivo) => arquivo.endsWith(".html"));
    for (const arquivo of arquivosHtml) {
      const conteudo = await readFile(new URL(arquivo, raiz), "utf8");
      for (const [, caminho] of conteudo.matchAll(/(?:src|href)="([^"#]+)"/g)) {
        if (/^(?:https?:|mailto:|tel:)/.test(caminho)) continue;
        const url = new URL(caminho, `${endereco}/${arquivo}`);
        const resposta = await fetch(url);
        assert.equal(resposta.status, 200, `${arquivo}: ${caminho}`);
        const corpo = await resposta.text();
        if (url.hash) assert.ok(corpo.includes(`id="${url.hash.slice(1)}"`), `${arquivo}: ${caminho}`);
      }
    }

    for (const caminho of ["/nao-existe", "/package.json", "/server.js", "/%2e%2e/package.json"]) {
      const resposta = await fetch(`${endereco}${caminho}`);
      assert.equal(resposta.status, 404, caminho);
      await resposta.text();
    }
  });
}
