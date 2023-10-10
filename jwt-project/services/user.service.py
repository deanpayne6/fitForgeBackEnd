'''const User = require('../models/User')
const ApiError = require('../utils/error')

module.exports = {
    async createUser (req, res) {
        try {
            if (!req.body) throw ApiError.badRequest('Bad')
            const { login } = req.body
            if (!login) throw ApiError.badRequest('Bad')

            const password = 'hash'
            const user = await User.create({ login, password })

            res.stauts(201).json(user.login)
        } catch (err) {
            console.log(err)
            res.staus(500).send({
                error: err
            })
            // return next(err)
        }
    }
}'''