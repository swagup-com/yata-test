const express = require("express");
const bodyParser = require("body-parser");
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  const jsonParser = bodyParser.json();

  server.get("/api/todos", getAll);
  server.post("/api/todos", jsonParser, createTODO);
  server.put("/api/todos/:id", jsonParser, updateTODO);
  server.delete("/api/todos/:id", deleteTODO);

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

let todos = [];

const getAll = (_req, res) => {
  res.status(200).send(todos);
};

const createTODO = (req, res) => {
  const { done, content, starred } = req.body;

  const todo = { done, content, starred, id: todos.length + 1 };

  todos = todos.concat(todo);
  res.status(201).send(todo);
};

const updateTODO = (req, res) => {
  const id = Number(req.params.id);

  const idx = todos.findIndex(x => x.id === id);
  if (idx < 0) {
    return res.sendStatus(404);
  }

  const { done, content, starred } = req.body;

  const todo = todos[idx];
  todos[idx] = { ...todo, done, content, starred };

  return res.status(200).send(todos[idx]);
};

const deleteTODO = (req, res) => {
  const id = Number(req.params.id);

  const idx = todos.findIndex(x => x.id === id);
  if (idx < 0) {
    return res.sendStatus(404);
  }

  todos = todos.filter((_, i) => i !== idx);

  return res.status(200).send();
};
