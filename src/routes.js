const Router = require('koa-router')

// middlewares
const error = require('./middlewares/error')
const authenticated = require('./middlewares/auth')

// handlers
const users = require('./handlers/users')
const auth = require('./handlers/auth')

const router = new Router()

router.use(error)

router.get('/users', authenticated, users.getAllUsers)
router.post('/users', authenticated, users.createUser)

router.post('/auth', auth.authenticate)
router.post('/auth/refreshToken', auth.refreshToken)
router.post('/auth/logout', auth.logout)
router.post('/generate-qr-code', authenticated, auth.generateQrCode)
router.post('/activate-two-factor', authenticated, auth.activateTwoFactor)

module.exports = router
