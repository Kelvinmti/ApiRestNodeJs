const express = require("express");

const server = express();

server.use(express.json());

const projects = [];

let cont = 0;

function checkProjectExists(req, res, next) {
  const id = req.params.id;

  if (!projects.find(p => p.id == id)) {
    return res.status(400).json({ error: "Project does not exist." });
  }

  return next();
}

server.use((req, res, next) => {
  cont++;

  console.log("Requisições efetuadas: " + cont);

  next();
});

server.post("/projects", (req, res) => {
  req.body.tasks = [];
  projects.push(req.body);

  return res.json(projects);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const id = req.params.id;

  const project = projects.find(p => p.id == id);
  project.title = req.body.title;

  const index = projects.findIndex(p => p.id == id);
  projects[index] = project;

  return res.json(project);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(p => p.id == id);
  projects.splice(index, 1);

  return res.send();
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const id = req.params.id;

  const project = projects.find(p => p.id == id);
  project.tasks.push(req.body.title);

  const index = projects.findIndex(p => p.id == id);
  projects[index] = project;

  return res.json(project);
});

server.listen(3000);
