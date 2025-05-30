import express from 'express';
import {select_random_anime, get_anime_data} from './functions.js'
import path from 'path'
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/env.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`window.ENV = {
    HOST_URL: "${process.env.HOST_URL}"
  };`);
});


app.get("/status", (request, response) => {
    const status = {
        "Status": "Running"
    };
    response.send(status)
});


app.get("/api/random_anime", async (request, response) => {
    const username = request.query.username as string;
    const status = request.query.status as string

    if (username && status) {
        const digitList: number[] = status.split('').map((char: string): number => parseInt(char, 10));
        const recommondation_data = await select_random_anime(username, digitList)
        response.json(recommondation_data);
    }
})

app.get("/api/anime_info", async (request, response) => {
  const animeURL = request.query.url as string;

  if (animeURL){
    const animeDetails = await get_anime_data(animeURL)
    response.json(animeDetails)
  }
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../static/index.html'));
});

app.get('/index.js', (req, res) => {
res.sendFile(path.join(__dirname, '../dist/index.js'));
})

app.get('/style.css', (req, res) => {
res.sendFile(path.join(__dirname, '../static/style.css'));
})

app.listen(PORT, () => {
    console.log("API-Server Listening on PORT: ", PORT)
})
