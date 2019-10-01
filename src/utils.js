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

export const fmoney=(number,n, separator)=> {
  let num = number + "";
  // 判断是否为数字
  if (!isNaN(parseFloat(num)) && isFinite(num)) {

      const n1=Math.pow(10,n);

      num = (Math.round(num* n1) / n1).toFixed(n);


      const parts = num.split('.');
      parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','));

      return parts.join('.');
  }
  return NaN;
}


export const sum=(arr) =>{
    let s = 0;
    for (let i=arr.length-1; i>=0; i--) {
      s += arr[i];
    }
    return s;
  }