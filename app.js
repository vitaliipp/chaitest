const express = require('express');
const app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.json());

const people = [];

// app.all("/api/v1/*", (req, res) => {
//   res.json({ error: "That route is not implemented." });
// });

//add a new person
app.post('/api/v1/people', (req, res) => {
  const { name, age } = req.body;
  if (!name) {
    res.status(400).json({ error: 'Please enter a name.' });
    return;
  }
  if (!age || age < 0) {
    res.status(400).json({ error: 'Please enter a valid age.' });
    return;
  }
  const index = people.push({ name, age }) - 1;
  res.status(201).json({ message: 'A person entry was added', index });
});

//get the array of people
app.get('/api/v1/people', (req, res) => {
  res.json(people);
});

//get a single person
app.get('/api/v1/people/:id', (req, res) => {
  const index = parseInt(req.params.id);
  if (index < 0 || index >= people.length || isNaN(index)) {
    res.status(404).json({ error: 'Person entry not found.' });
    return;
  }
  res.json(people[index]);
});

const server = app.listen(3000, () => {
  console.log('listening on port 3000...');
});

module.exports = { app, server };
