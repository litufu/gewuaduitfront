export function validatePassword(password){
    const format = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/
    return (password.toUpperCase() !== password) &&
    (password.toLowerCase() !== password) &&
    (/\d/.test(password)) &&
    (format.test(password)) &&
    (password.length > 10)
}

