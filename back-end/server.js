const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');

const database = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '',
    database: 'postgres'
  }
});


app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {
  res.json(database.users);
})

app.post('/signin', (req, res) => {
  database.select('email', 'password').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].password);
      if (isValid) {
        return database.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => { res.json(user[0]) })
          .catch(err => res.status(400).json('unable to get the user'))
      } else {
        res.status(400).json('Wrong credentials')
      }
    }).catch(err => res.status(400).json('Wrong credentials'))
})

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const password_hash = bcrypt.hashSync(password);
  database.transaction(trx => {
    trx.insert({
      email: email,
      password: password_hash
    }).into('login').returning('email')
      .then(emailLogin => {
        return trx('users').returning('*').insert({
          name: name,
          email: emailLogin[0],
          entries: 0,
          joined: new Date()
        }).then(user => { res.json(user[0]) })
      }).then(trx.commit)
      .catch(trx.rollback)
  })
    .catch(err => res.status(400).json(err))
})

app.get('/profile/:id', (req, res) => {
  database.select('*').from('users')
    .where({ 'id': req.params.id })
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('User not found')
      }
    }).catch(err => res.status(400).json('Error getting the user'))
})


app.put('/image', (req, res) => {
  const { id } = req.body;
  console.log(req.body)
  database('users').where('id', '=', id).increment('entries', 1)
    .returning('entries').then(entries => {
      res.json(entries[0])
    }).catch(err => res.status(400).json('Unable to get the entery count'))
})


app.listen(3000, () => console.log('Example app listening on port 3000!'))