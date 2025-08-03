const { test, after, beforeEach } = require('node:test')
const assert = require('assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')



const api = supertest(app)
let token

const blogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }  
]

const newUser = {
  username: 'tester',
  name: 'Test User',
  password: 'testpass'
}

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(blogs)
  
  await User.deleteMany({})
  await api.post('/api/users').send(newUser)

  const login = await api
  .post('/api/login')
  .send({ username: 'tester', password: 'testpass' })

  token = login.body.token
  
})

test('blogs returned as JSON and there are 6', async () => {
  const response = await api.get('/api/blogs')
  .expect(200)
  .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, blogs.length)
})

after(async () => {
  await mongoose.connection.close()
})

test('unique identifier property of blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body[0]

  assert.ok(blog.id)        
  assert.strictEqual(typeof blog.id, 'string') 
  assert.strictEqual(blog._id, undefined) 
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'new blog',
    author: 'Alfredo Mompó',
    url: 'htts://fullstackopen',
    likes: 3
  }

  await api
  .post('/api/blogs')
  .set('Authorization', `Bearer ${token}`)
  .send(newBlog)
  .expect(201)
  .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const addedBlog = response.body.find(b => b.title === newBlog.title)

  assert.strictEqual(response.body.length, blogs.length + 1)
  assert.strictEqual(addedBlog.author, newBlog.author)
})

test('if likes property is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'Blog',
    author: 'missing',
    url: 'https://nolikes.com'
  }

  const response = await api
  .post('/api/blogs')
  .send(newBlog)
  .set('Authorization', `Bearer ${token}`)
  .expect(201)
  .expect('Content-Type', /application\/json/)

  const addedBlog = response.body

  assert.strictEqual(addedBlog.likes, 0)
})

test('blog without title is not added and returns 400', async () => {
  const newBlog = {
    author: 'Anon',
    url: 'https://none-title.com',
    likes: 1
  }

  await api
  .post('/api/blogs')
  .set('Authorization', `Bearer ${token}`)
  .send(newBlog)
  .expect(400)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, blogs.length)
})

test('blog without url is not added and returns 400', async () => {
  const newBlog = {
    title: 'not URL',
    author: 'Alfredo',
    likes: 1
  }

  await api
  .post('/api/blogs')
  .set('Authorization', `Bearer ${token}`)
  .send(newBlog)
  .expect(400)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, blogs.length)
})

test('a blog can be deleted', async () => {
  const newBlog = {
    title: 'Temp blog to delete',
    author: 'User Owner',
    url: 'https://tobedeleted.com',
    likes: 0
  }

  //add with token from newUser
  const addedBlogResponse = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  //delete with same token
  await api
    .delete(`/api/blogs/${addedBlogResponse.body.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)


  const blogsAfter = await api.get('/api/blogs')
  const ids = blogsAfter.body.map(b => b.id)

  assert.ok(!ids.includes(addedBlogResponse.body.id))

})

test('a blog can be updated', async () => {
  const initialBlogs = await api.get('/api/blogs')
  const blogToUpdate = initialBlogs.body[0]

  const updatedBlog = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 1
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
})

test('adding a blog without token returns 401', async () => {
  const newBlog = {
    title: 'Unauthorized Blog',
    author: 'No Token',
    url: 'https://no-token.com',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})






