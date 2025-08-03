const { test, after, beforeEach, describe } = require('node:test')
const assert = require('assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const listHelper = require('../utils/list_helper')
const User = require('../models/user')

const api = supertest(app)



describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await listHelper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
})

test('creation fails with status 400 if username is too short', async () => {
  const newUser = {
    username: 'ro', // 2 characters
    name: 'Short Name',
    password: 'validpassword'
  }

  const response = await api
    .post('/api/users')
    .send(newUser)

  assert.strictEqual(response.status, 400)
})

test('creation fails with status 400 if password is too short', async () => {
  const newUser = {
    username: 'validusername',
    name: 'Short Password',
    password: 'pw' // too short
  }

  const response = await api
    .post('/api/users')
    .send(newUser)

  assert.strictEqual(response.status, 400)
})

test('creation fails with status 400 if username already exists', async () => {
  const newUser = {
    username: 'root', // already in DB
    name: 'Duplicate',
    password: 'validpassword'
  }

  const response = await api
    .post('/api/users')
    .send(newUser)

  assert.strictEqual(response.status, 400)
})