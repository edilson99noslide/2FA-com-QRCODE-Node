const users = require('./user')
const crypto = require('./crypto')
const tokenService = require('./token')
const otplib = require('otplib')
const qrcode = require('qrcode')

// illustration purposes only
// for production-ready code, use error codes/types and a catalog (maps codes -> responses)

/* eslint-disable prefer-promise-reject-errors */
const authFailed = () => Promise.reject({
  status: 401,
  code: 'UNAUTHENTICATED',
  message: 'Failed to authenticate',
})

const authenticate = async ({ email, password, twoFactorToken }) => {
  const user = await users.findByEmail(email)

  if (!user) {
    return authFailed()
  }

  const isMatch = await crypto.compare(password, user.password)

  if (!isMatch) {
    return authFailed()
  }

  if (user.twoFaEnabled && !twoFactorToken) {
    throw new Error('twoFactorToken is required.')
  }

  if (user.twoFaEnabled) {
    const isTowFactorValid = otplib.authenticator.verify({
      token: twoFactorToken,
      secret: user.twoFaSecret,
    })

    if (!isTowFactorValid) {
      await authFailed()
    }
  }

  const { token: refreshToken, expiresAt: refreshTokenExpiration } = await tokenService.createRefreshToken(user.id)
  return {
    refreshToken,
    refreshTokenExpiration,
    accessToken: tokenService.sign({ id: user.id, role: user.role }),
  }
}

const refreshToken = async ({ token }) => {
  const refreshTokenObject = await tokenService.getRefreshToken(token)

  if (refreshTokenObject &&
    refreshTokenObject.valid &&
    refreshTokenObject.expiresAt >= Date.now()
  ) {
    await tokenService.invalidateRefreshToken(token)

    const user = await users.findById(refreshTokenObject.user_id)
    const { token: refreshToken, expiresAt: refreshTokenExpiration } = await tokenService.createRefreshToken(user.id)
    return {
      refreshToken,
      refreshTokenExpiration,
      accessToken: tokenService.sign({ id: user.id, role: user.role }),
    }
  }
  return authFailed()
}

const logout = async ({ token, allDevices }) => {
  if (allDevices) {
    return tokenService.invalidateAllUserRefreshTokens(token)
  }
  return tokenService.invalidateRefreshToken(token)
}

const generateQrCode = async userId => {
  // cria a secret
  const secret = otplib.authenticator.generateSecret()
  console.log('secret = ', secret)

  await users.addTwoFASecret(userId, secret)

  // Configurando o auth
  const otpAuth = otplib.authenticator.keyuri(userId, 'QR Code Rocketseat', secret)

  console.log('otpAuth =', otpAuth)

  // retornando o QRCode
  return qrcode.toDataURL(otpAuth)
}

const activateTwoFactor = async (userId, token) => {
  const { twoFaSecret: secret } = await users.findById(userId)

  console.log(secret)

  if (otplib.authenticator.verify({ token, secret })) {
    await users.activateTwoFactor(userId)
  } else {
    throw new Error('Incorrect Token.')
  }
}

module.exports = {
  authenticate,
  refreshToken,
  logout,
  generateQrCode,
  activateTwoFactor,
}
