const express = require('express')
const db = require('./data/dbConfig.js')
const bcrypt = require('bcryptjs')
const server = express()
const jwt = require('jsonwebtoken')
// const session = require('express-session')
const restricted = require('./restricted.js')

server.use(express.json())

server.get('/api/users', restricted, (req, res) => {
  //yeet
})
server.post('/api/login', (req, res) => {
  //yeet the sequel
})
server.post('/api/register', (req, res) => {
  //yeet the final destination
})
server.get('/api/logout', (req, res) => {
  //yeet the beginning
})

module.exports = server