const jwt = require('jsonwebtoken')
const User = require('../models/user') 

//validates token and extract user
const userExtractor = async (request, response, next) => {
   const token = request.token  //tokenExtractor

  if (!token) {
    return response.status(401).json({ error: 'token missing' })
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    const user = await User.findById(decodedToken.id)
    if (!user) {
      return response.status(401).json({ error: 'user not found' })
    }

    request.user = user
    next()
  } catch (error) {
    next(error) 
  }
}

module.exports = userExtractor
