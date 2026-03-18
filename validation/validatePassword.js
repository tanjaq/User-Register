function validatePassword(password) {
    if (!password) return false
    // Must have at least 1 lowercase, 1 uppercase, 1 number, only letters & digits, min 8 chars
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/
    return re.test(password)
}

module.exports = validatePassword