import express = require('express');

// curl --url http://localhost:3000/analyze --data "{\"message\":\"aaa\"}"  -H "Content-Type: application/json"
// curl --url http://localhost:3000/analyze/1/cancel --data ""
// curl --url http://localhost:3000/analyze/1

interface AnalyzeRequestData {
  message: string;
}

interface AnalyzeTask {
  id: number;
  status: 'inProgress' | 'cancelled' | 'finished';
  result?: 'positive' | 'negative';
}

// Create a new express application instance
const app: express.Application = express();

const tasks: Record<number, AnalyzeTask> = {};
app.use(express.json());

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.post('/analyze', function (req, res) {
  // const data = req.body as AnalyzeRequestData;

  const id = Object.values(tasks).length 
    ? Math.max(...Object.values(tasks).map(task => task.id)) + 1
    : 1;
  const task: AnalyzeTask = {
    id,
    status: 'inProgress',
  };
  tasks[id] = task;

  setTimeout(() => {
    if (tasks[id].status === 'inProgress') {
      tasks[id].status = 'finished';
      tasks[id].result = Math.random() > 0.5 ? 'positive' : 'negative';
    }
  }, 10000 + Math.random() * 5000);

  res.json(task);
});

app.get('/analyze/:taskId', function (req, res) {
  const taskId = parseInt(req.params.taskId);
  if (tasks[taskId] === undefined) {
    res.status(404);
  } else {
    res.json(tasks[taskId]);
  }
  res.end();
});

app.post('/analyze/:taskId/cancel', function (req, res) {
  const taskId = parseInt(req.params.taskId);
  if (tasks[taskId] === undefined) {
    res.status(404);
  } else {
    tasks[taskId].status = 'cancelled';
    const { id, status } = tasks[taskId];
    res.json({ id, status });
  }
  res.end();
});

app.get('/analyze-buggy/:taskId', function (req, res) {
  if (Math.random() > 0.5) {
    res.status(503);
    res.write('Service unavailable! Try again!');
    res.end();
    return;
  }

  const taskId = parseInt(req.params.taskId);
  if (tasks[taskId] === undefined) {
    res.status(404);
  } else {
    res.json(tasks[taskId]);
  }
  res.end();
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});