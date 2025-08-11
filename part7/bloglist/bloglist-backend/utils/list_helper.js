//4.3 
const dummy = (blogs) => {
  return 1
}

//4.4
const totalLikes = (blogs) => {
//reduce: array into 1 value through an operation
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

//4.5
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const favorite = blogs.reduce((prev, current) => 
    current.likes > prev.likes ? current : prev
  )
  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

//4.6
const _ = require('lodash')

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  // 1. Group by author
  const grouped = _.groupBy(blogs, 'author')
  //   "Michael Chan": [ {...} ],

  // 2. array with { author, blogs }
  const authorsCount = _.map(grouped, (blogs, author) => ({
    author,
    blogs: blogs.length
  }))

  return _.maxBy(authorsCount, 'blogs')
}

//4.7
const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const grouped = _.groupBy(blogs, 'author')

  const authorsLikes = _.map(grouped, (blogs, author) => ({
    author,
    likes: _.sumBy(blogs, 'likes')
  }))

  return _.maxBy(authorsLikes, 'likes')
}

const User = require('../models/user')

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes, usersInDb
}