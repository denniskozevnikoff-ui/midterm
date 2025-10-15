/**
 * Midterm API Project - COMP229
 *
 * Challenge: Implement the API logic for managing a collection of video games!
 */

const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());

// static files in public
app.use(express.static(path.join(__dirname, 'public')));

// sample games data
let games = [
  { title: 'The Legend of Zelda: Breath of the Wild', genre: 'Adventure', platform: 'Nintendo Switch', year: 2017, developer: 'Nintendo' },
  { title: 'God of War', genre: 'Action', platform: 'PlayStation 4', year: 2018, developer: 'Santa Monica Studio' },
  { title: 'Hollow Knight', genre: 'Metroidvania', platform: 'PC', year: 2017, developer: 'Team Cherry' },
  { title: 'Forza Horizon 5', genre: 'Racing', platform: 'Xbox Series X|S', year: 2021, developer: 'Playground Games' },
  { title: 'Stardew Valley', genre: 'Simulation', platform: 'Nintendo Switch', year: 2016, developer: 'ConcernedApe' }
];

const PORT = 3000;

// serve homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// get all games
app.get('/api/games', (req, res) => {
  res.status(200).json(games);
});

// filter by genre
app.get('/api/games/filter', (req, res) => {
  const genreQuery = req.query.genre;

  if (!genreQuery) {
    return res.status(400).json({ message: "please provide a genre query parameter" });
  }

  const filteredGames = games.filter(game =>
    game.genre.toLowerCase() === genreQuery.toLowerCase()
  );

  if (filteredGames.length === 0) {
    return res.status(404).json({ message: `no games found for genre: ${genreQuery}` });
  }

  res.status(200).json(filteredGames);
});

// get one game by id
app.get('/api/games/:id', (req, res) => {
  const idParam = req.params.id;
  const id = Number(idParam);

  if (!Number.isInteger(id) || id < 0) {
    return res.status(400).json({ message: 'invalid id. use a non-negative integer' });
  }

  if (id >= games.length) {
    return res.status(404).json({ message: `game not found for id: ${id}` });
  }

  return res.status(200).json(games[id]);
});

// add new game
app.post('/api/games', (req, res) => {
  const { title, genre, platform, year, developer } = req.body;

  if (!title || !genre || !platform || !developer) {
    return res.status(400).json({ message: 'missing required fields' });
  }

  if (year !== undefined && year !== null && !Number.isInteger(Number(year))) {
    return res.status(400).json({ message: 'year must be an integer if provided' });
  }

  const newGame = {
    title: String(title),
    genre: String(genre),
    platform: String(platform),
    year: year !== undefined && year !== null ? Number(year) : undefined,
    developer: String(developer)
  };

  games.push(newGame);
  const newId = games.length - 1;

  res.status(201)
     .location(`/api/games/${newId}`)
     .json({ id: newId, ...newGame });
});

// update a game
app.put('/api/games/:id', (req, res) => {
  const idParam = req.params.id;
  const id = Number(idParam);

  if (!Number.isInteger(id) || id < 0 || id >= games.length) {
    return res.status(404).json({ message: `game not found for id: ${idParam}` });
  }

  const { title, genre, platform, year, developer } = req.body;

  if (year !== undefined && year !== null && !Number.isInteger(Number(year))) {
    return res.status(400).json({ message: 'year must be an integer if provided' });
  }

  if (title !== undefined) games[id].title = String(title);
  if (genre !== undefined) games[id].genre = String(genre);
  if (platform !== undefined) games[id].platform = String(platform);
  if (developer !== undefined) games[id].developer = String(developer);
  if (year !== undefined) games[id].year = year !== null ? Number(year) : undefined;

  res.status(200).json({ id, ...games[id] });
});

// delete a game
app.delete('/api/games/:id', (req, res) => {
  const idParam = req.params.id;
  const id = Number(idParam);

  if (!Number.isInteger(id) || id < 0 || id >= games.length) {
    return res.status(404).json({ message: `game not found for id: ${idParam}` });
  }

  const removedGame = games.splice(id, 1)[0];
  res.status(200).json({ message: `game with id ${id} deleted`, deletedGame: removedGame });
});

// start server
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
