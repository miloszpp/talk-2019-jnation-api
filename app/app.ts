import express = require('express');
const cors = require('cors')

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
app.use(cors());

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
  }, 5000 + Math.random() * 5000);

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

const stocks: Record<string, number | undefined> = {
  aapl: 203,
  goog: 1236,
  fb: 178,
  msft: 123,
};

app.get('/stocks/:symbol', function (req, res) {
  if (Math.random() > 0.3) {
    res.status(503);
    res.write('Service unavailable! Try again!');
    res.end();
    return;
  }

  const symbol = (req.params.symbol as string).toLowerCase();
  if (!Object.keys(stocks).includes(symbol)) {
    res.status(404);
  } else {
    res.json({ 
      price: stocks[symbol],
      timestamp: Date.now(),
    });
  }
  
  res.end();
});

const articles = [
  {
    "id": 1,
    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
  },
  {
    "id": 2,
    "title": "qui est esse",
    "body": "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
  },
  {
    "userId": 1,
    "id": 3,
    "title": "ea molestias quasi exercitationem repellat qui ipsa sit aut",
    "body": "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut"
  },
];

app.get('/articles', function (req, res, next) {
  setTimeout(() => {
    res.json(articles.map(article => ({ ...article, body: undefined })));
    next();
  }, 2000);
})

app.get('/articles/:articleId', function (req, res, next) {
  const articleId = parseInt(req.params.articleId);
  const article = articles.find(article => article.id === articleId);

  setTimeout(() => {
    if (article) {
      res.json(article);
    } else {
      res.status(404);
    }
    next();
  }, 2000);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
  console.log('Example app listening on port 3000!');
});