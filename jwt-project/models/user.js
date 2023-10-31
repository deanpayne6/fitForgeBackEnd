
class User {
  constructor(email, username, first_name, last_name, age) {
    this.email = email,
    this.username = username,
    this.password = null,
    this.first_name = first_name,
    this.last_name = last_name,
    this.age = age
  }
}

module.exports = User;