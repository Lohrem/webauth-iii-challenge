module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/Users.db3'
    },
    useNullAsDefault: true
  }
}