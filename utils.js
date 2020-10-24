const generateId = () => {
    const id = Math.floor(Math.random() * 50000)
    return id
  }

  module.exports = {
      generateId
  }