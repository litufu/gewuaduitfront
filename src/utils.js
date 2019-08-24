export function validatePassword(password){
    const format = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/
    return (password.toUpperCase() !== password) &&
    (password.toLowerCase() !== password) &&
    (/\d/.test(password)) &&
    (format.test(password)) &&
    (password.length > 10)
}

export const dateToString=(date)=>{
    const year = date.getFullYear()
    const month = date.getMonth()	+ 1
    const day = date.getDate()
    return `${year}-${month}-${day}`
  }