const express = require("express");
const bodyParser = require("body-parser");
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handle = app.getRequestHandler();

let todos = [];

app.prepare().then(() => {
  const server = express();

  const jsonParser = bodyParser.json();

  server.get("/api/todos", (_req, res) => {
    res.send(todos);
  });

  server.post("/api/todos", jsonParser, (req, res) => {
    const { done, content, starred } = req.body;

    const todo = { done, content, starred, id: todos.length + 1 };
    todos = todos.concat(todo);

    res.status(201).send(todo);
  });

  server.put("/api/todos/:id", jsonParser, (req, res) => {
    const id = Number(req.params.id);

    const idx = todos.findIndex(x => x.id === id);
    if (idx < 0) {
      return res.sendStatus(404);
    }

    const { done, content, starred } = req.body;

    todos = todos.map(x =>
      x.id === id ? { ...x, done, content, starred } : { ...x }
    );

    res.send(todos.find(x => x.id === id));
    return;
  });

  server.delete("/api/todos/:id", (req, res) => {
    const { id } = req.params;

    const idx = todos.findIndex(x => x.id === id);
    if (idx < 0) {
      return res.sendStatus(404);
    }

    todos = todos.filter(x => x.id === id);

    return res.send();
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) {
      throw err;
    }

    console.log(`> Ready on http://localhost:${port}`);
  });
});
