require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const { Client } = require('pg')

const router = express.Router()
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT
})

client.connect()

router.use(authenticateToken)

router.get('/', async (req, res) => {
  try {
    const info = await client.query(`
      SELECT * FROM posts WHERE user_by = $1
    `, [req.user.username])
    res.send(info.rows)
  } catch (err) {
    res.sendStatus(401)
    console.log('Something wrong with the query.')
  }
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


module.exports = router