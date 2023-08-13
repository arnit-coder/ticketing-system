const express = require('express');
const bodyParser = require('body-parser');
const { people, tickets, ticketCounter } = require('./data');

const app = express();
app.use(bodyParser.json());
let cors = require("cors");
app.use(cors());

// Assign a ticket to a person based on Round Robin Principle
function assignTicketToPerson(issueDescription, raisedBy) {
  const person = people[ticketCounter % people.length];
  const ticket = {
    id: ticketCounter,
    issueDescription,
    assignedTo: person.id,
    raisedBy
  };
  person.tickets.push(ticket);
  tickets.push(ticket);
  ticketCounter++;
  return ticket;
}

// API Endpoint to create a new ticket
app.post('/tickets', (req, res) => {
  const { issueDescription, raisedBy } = req.body;
  if (!issueDescription || !raisedBy) {
    return res.status(400).json({ message: 'Issue description and raised by are required.' });
  }
  const ticket = assignTicketToPerson(issueDescription, raisedBy);
  res.status(201).json(ticket);
});

// API Endpoint to get all people and their tickets
app.get('/people', (req, res) => {
  res.json(people);
});

// API Endpoint to get all tickets
app.get('/tickets', (req, res) => {
  res.json(tickets);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
