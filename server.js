const express = require('express')
const db = require('./data/dbConfig.js')
const bcrypt = require('bcryptjs')
const server = express()
const jwt = require('jsonwebtoken')
const session = require('express-session')
const restricted = require('./restricted.js')
const secrets = require('./config/secrets.js')

const sessionConfig = {
  name: 'captain america',
  secret: 'avengersassemble',
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false
}

server.use(express.json())
server.use(session(sessionConfig))

server.get('/api/users', restricted, async (req, res) => {
  try {
    const users = await db('Users')
    res.status(200).json(users)
  } catch (err) {
    console.log(err)
    res.status(500).json(500)
  }
})
server.post('/api/login', async (req, res) => {
  const {
    username,
    password
  } = req.body
  const user = await db('Users').where({
    username
  }).first()
  try {
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = genToken(user)
      res.status(200).json({
        message: `Welcome ${user.username}`,
        token
      })
    } else {
      res.status(404).json({
        message: `Invalid credentials`
      })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})
server.post('/api/register', async (req, res) => {
  const user = req.body
  const hash = bcrypt.hashSync(user.password, 12)
  user.password = hash
  try {
    if (!user.username || !user.password || !user.department) {
      res.json({
        message: "All fields must be filled in"
      })
    } else {
      const newUser = await db('users').insert(user)
      res.status(201).json(newUser)
    }
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})
server.get('/api/logout', async (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) res.json({
        error: "error logging you out"
      })
      else res.status(200).json({
        message: "see ya"
      })
    })
  } else {
    res.status(200).json({
      message: "yeet"
    })
  }
})

function genToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  }
  const options = {
    expiresIn: '1h'
  }

  return jwt.sign(payload, secrets.jwtSecret, options)
}

module.exports = server