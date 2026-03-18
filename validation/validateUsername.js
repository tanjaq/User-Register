function validateUsername(username) {
    if (!username) return false
    const validLength = username.length >= 6 && username.length <= 30
    const allowedCharacters = /^[a-zA-Z0-9.]+$/g.test(username)
    return validLength && allowedCharacters
}

module.exports = validateUsername