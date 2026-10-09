import { createServer } from 'node:http';

const hostname = '127.0.0.1';
const port = 3015;

const server = createServer((req, res) => {
  console.log('Em execucao');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'appplication/json');
  res.end('Servidor rodando');
});

server.listen(port, hostname, () => {
  console.log(`Servidor em execução: http://${hostname}:${port}/`);
});