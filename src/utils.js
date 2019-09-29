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

export const fmoney=(s, n)=> {  
    n = n > 0 && n <= 20 ? n : 2;  
    s = parseFloat((s + "").replace(/[^\d.-]/g, "")).toFixed(n) + "";  
    const l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];  
    let t = "";  
    for (let i = 0; i < l.length; i++) {  
        t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ? "," : "");  
    }  
    return t.split("").reverse().join("") + "." + r;  
}  


export const sum=(arr) =>{
    let s = 0;
    for (let i=arr.length-1; i>=0; i--) {
      s += arr[i];
    }
    return s;
  }