
import { sum,fmoney } from '../utils'

// 年度按照365天计算
// 月度按照30天计算

function getYearsValue(year,occour_times,end_time){
    const occurs = JSON.parse(occour_times).filter(item=>{
        if((end_time - item.occur_time)<=(year+1)*31536000*1000 && (end_time - item.occur_time+1)>(year)*31536000*1000){
            return true
        }else{
            return false
        }
    })
    const occur_values = occurs.map(occur=>occur.value)
    return sum(occur_values)
}

function getGreaterYearsValue(year,occour_times,end_time){
    const occurs = JSON.parse(occour_times).filter(item=>{
        if((end_time - item.occur_time)>(year)*31536000*1000){
            return true
        }else{
            return false
        }
    })
    const occur_values = occurs.map(occur=>occur.value)
    return sum(occur_values)
}

export default function getYearsColumns(years){
    const res = []
    for(let i=0;i<years;i++){
        const title = `${i}年到${i+1}年`
        const field = `years${i}`
        const render = rowData =>fmoney(getYearsValue(i,rowData.occour_times,rowData.end_time),2)
        res.push({title,field,render}) 
    }
    res.push({
        title:`${years}以上`,
        field:`years${years}`,
        render:rowData =>fmoney(getGreaterYearsValue(years,rowData.occour_times,rowData.end_time),2)
    })
    return res
}