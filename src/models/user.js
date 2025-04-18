module.exports = (sequelize, DataTypes) => {
  const schema = {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    twoFaSecret: DataTypes.STRING,
    twoFaEnabled: DataTypes.STRING,
    recoveryCode: DataTypes.STRING,
  }
  const modelOptions = {
    tableName: 'users',
  }
  const User = sequelize.define('User', schema, modelOptions)

  return User
}
