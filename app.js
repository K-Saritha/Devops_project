const express = require("express");
const app = express();
const path = require("path");

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage for tasks
let tasks = [];
let taskId = 1;

// Routes
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Task text is required" });
  }

  const newTask = {
    id: taskId++,
    text,
    completed: false,
    createdAt: new Date()
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  task.completed = !task.completed;
  res.json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => {
  console.log("To-Do List App running on port 3000");
});
