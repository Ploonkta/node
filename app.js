require('dotenv').config()
const express = require('express')
const { Client } = require('pg')
const jwt = require('jsonwebtoken')

const app = express()
const port = process.env.PORT

const postRouter = require('./routes/posts')

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT
})

// Connects to the postgres database

client.connect()
  .then(async () => {
    console.log('Successfully connected to postgres database!')
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS accounts (
        id BIGSERIAL NOT NULL PRIMARY KEY UNIQUE,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
      `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id BIGSERIAL NOT NULL PRIMARY KEY UNIQUE,
        user_by VARCHAR(100) NOT NULL REFERENCES accounts(username),
        user_id BIGINT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
        title VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
  })
  .catch(err => console.log('Unable to connect to postgres!', err))

// Middleware

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
  res.send('Home page.')
})


app.get('/login', (req, res) => {
  res.send(`
    <h1>Login Page</h1>
    <form action='/login' method='POST'>
      <label>Username</label>
      <input type='text' id='username' name='username' required />
      <label>Password</label>
      <input type='text' id='password' name='password' required />
      <button type='submit'>Login</button>
    </form>
    <button onclick="location.href='/signup'">Create Account</button>
    `)
})


app.post('/login', async (req, res) => {
  const { username, password } = req.body
  
  try {
    const rest = await client.query(`
      SELECT * FROM accounts WHERE username = $1 AND password = $2
      `, [username.trim(), password])
    
    if (rest.rows.length > 0) {
      console.log('Valid')
      const user = { username: username, password: password}
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

      res.json({accessToken: accessToken})
    } else {
      res.send('Invalid username and password')
    }
  } catch (err) {
    console.log('Error in the login request.')
  }
  
})


app.get('/signup', (req, res) => {
  res.send(
  `
  <h1>Create Account Page</h1>
    <form action='/signup' method='POST'>
      <label>Username</label>
      <input type='text' name='create_username' required />
      <label>Password</label>
      <input type='text' name='create_password' required />
      <button type='submit'>Login</button>
    </form>
  `)
})


app.post('/signup', async (req, res) => {
  const { create_username, create_password } = req.body
  try {
    await client.query(`
    INSERT INTO accounts (username, password)
      VALUES ($1, $2)
    `, [create_username, create_password])
    console.log('Successfully Added to the Database!')
    res.redirect('/login')
  } catch (err) {
    console.log('Query Error!', err)
    res.redirect('/error')
  }
})


app.use('/posts', postRouter)


app.get('/error', (req, res) => {
  res.send(`
      <h1>Error, username already taken</h1>
      <button onClick="location.href='/signup'">Go Back!</button>
    `)
})

app.listen(port, () => {
  console.log(`Connected to ${port}!`)
})


function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (authHeader === null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
      req.user = user
  next()
  })
}