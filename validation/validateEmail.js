function validateEmail(email) {
    if (!email) return false
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
    return re.test(email)
}

module.exports = validateEmail