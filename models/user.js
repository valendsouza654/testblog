module.exports = (sequelize, type) => {
    return sequelize.define('user', {
        userid: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: type.STRING,
        username: type.STRING,
        password: type.STRING
    })
}