/**
 * Midterm API Project - COMP229
 *
 * Challenge: Implement the API logic for managing a collection of video games!
 *
 * Here's the setup:
 * A server is already running on port 3000 with an array of game objects.
 * Your mission is to implement the missing logic for each of the endpoints below.
 *
 * Endpoints:
 * 1. GET /api/games       - Retrieve the full list of games.
 * 2. GET /api/games/filter?genre=[genre name] - Retrieve games by genre match.
 * 3. GET /api/games/:id   - Retrieve a game by its index.
 * 4. POST /api/games      - Add a new game to the library.
 * 5. PUT /api/games/:id   - Update a game by its index.
 * 6. DELETE /api/games/:id - Remove a game from the library by its index.
 *
 * The array of games is already defined for you, but you need to bring the logic
 * to life. Test your work using tools like Postman, Thunder Client, or Insomnia.
 *
 * Submission Requirements:
 * 1. Screenshots: Provide one per endpoint, showing the request details and a
 *    successful response with the correct status code.
 * 2. Code Submission: Zip your project, share the repo link, and ensure your
 *    personalized games are present.
 *
 * Good luck, and may your code be bug-free!
 */

const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());

// Serve static files (e.g., images, CSS) from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Array of game objects
let games = [
  { title: 'The Legend of Zelda: Breath of the Wild', genre: 'Adventure', platform: 'Nintendo Switch', year: 2017, developer: 'Nintendo' },
  { title: 'God of War', genre: 'Action', platform: 'PlayStation 4', year: 2018, developer: 'Santa Monica Studio' },
  { title: 'Hollow Knight', genre: 'Metroidvania', platform: 'PC', year: 2017, developer: 'Team Cherry' },
  { title: 'Forza Horizon 5', genre: 'Racing', platform: 'Xbox Series X|S', year: 2021, developer: 'Playground Games' },
  { title: 'Stardew Valley', genre: 'Simulation', platform: 'Nintendo Switch', year: 2016, developer: 'ConcernedApe' }
];

// Set the port for the server
const PORT = 3000;

// Serve the instructions HTML file (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// API Endpoints

// GET /api/games
// Description: Get all games
// Task: Implement logic to return the full list of games
app.get('/api/games', (req, res) => {
  res.status(200).json(games);
 // res.status(501).send('Not Implemented');
});

// GET /api/games/filter?genre=[genre name]
// Description: Filter games by genre
// Task: Implement logic to return games matching the specified genre
app.get('/api/games/filter', (req, res) => {
   const genreQuery = req.query.genre;

  if (!genreQuery) {
    return res.status(400).json({ message: "Please provide a genre query parameter." });
  }

  const filteredGames = games.filter(game =>
    game.genre.toLowerCase() === genreQuery.toLowerCase()
  );

  if (filteredGames.length === 0) {
    return res.status(404).json({ message: `No games found for genre: ${genreQuery}` });
  }

  res.status(200).json(filteredGames);
});

// GET /api/games/:id
// Description: Get a specific game by ID
// Task: Implement logic to return a game by its index (ID)
app.get('/api/games/:id', (req, res) => {
  const idParam = req.params.id;

  // Validate that id is an integer >= 0
  const id = Number(idParam);
  if (!Number.isInteger(id) || id < 0) {
    return res.status(400).json({ message: 'Invalid id. Provide a non-negative integer index.' });
  }

  // Check bounds
  if (id >= games.length) {
    return res.status(404).json({ message: `Game not found for id: ${id}` });
  }

  // Return the game
  return res.status(200).json(games[id]);
});

// POST /api/games
// Description: Add a new game
// Task: Implement logic to add a new game to the array
app.post('/api/games', (req, res) => {
   const { title, genre, platform, year, developer } = req.body;

  // Basic validation
  if (!title || !genre || !platform || !developer) {
    return res.status(400).json({ message: 'Missing required fields. Required: title, genre, platform, developer. Year is optional but should be a number if provided.' });
  }

  if (year !== undefined && year !== null && !Number.isInteger(Number(year))) {
    return res.status(400).json({ message: 'Year must be an integer if provided.' });
  }

  // Create new game object
  const newGame = {
    title: String(title),
    genre: String(genre),
    platform: String(platform),
    year: year !== undefined && year !== null ? Number(year) : undefined,
    developer: String(developer)
  };

  // Add to array and respond with 201 Created
  games.push(newGame);
  const newId = games.length - 1; // index of inserted item

  // Return the created resource and its id
  res.status(201)
     .location(`/api/games/${newId}`)
     .json({ id: newId, ...newGame });
});

// PUT /api/games/:id
// Description: Update a game by ID
// Task: Implement logic to update a game by its index (ID)
app.put('/api/games/:id', (req, res) => {
  const idParam = req.params.id;
  const id = Number(idParam);

  // Validate id
  if (!Number.isInteger(id) || id < 0 || id >= games.length) {
    return res.status(404).json({ message: `Game not found for id: ${idParam}` });
  }

  const { title, genre, platform, year, developer } = req.body;

  if (year !== undefined && year !== null && !Number.isInteger(Number(year))) {
    return res.status(400).json({ message: 'Year must be an integer if provided.' });
  }

  // Update fields (only if provided)
  if (title !== undefined) games[id].title = String(title);
  if (genre !== undefined) games[id].genre = String(genre);
  if (platform !== undefined) games[id].platform = String(platform);
  if (developer !== undefined) games[id].developer = String(developer);
  if (year !== undefined) games[id].year = year !== null ? Number(year) : undefined;

  res.status(200).json({ id, ...games[id] });
});

// DELETE /api/games/:id
// Description: Remove a game by ID
// Task: Implement logic to remove a game by its index (ID)
app.delete('/api/games/:id', (req, res) => {
 const idParam = req.params.id;
  const id = Number(idParam);

  // Validate id
  if (!Number.isInteger(id) || id < 0 || id >= games.length) {
    return res.status(404).json({ message: `Game not found for id: ${idParam}` });
  }

  // Remove the game from the array
  const removedGame = games.splice(id, 1)[0]; // splice returns an array of removed items

  // Return success message and the deleted game
  res.status(200).json({ message: `Game with id ${id} deleted successfully.`, deletedGame: removedGame });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});