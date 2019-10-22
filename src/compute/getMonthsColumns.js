
import _ from 'lodash'
import { sum,fmoney } from '../utils'

// 年度按照365天计算
// 月度按照30天计算

function getMonhtsValue(start_month,end_month,occour_times,end_time){
    const occurs = JSON.parse(occour_times).filter(item=>{
        if((end_time - item.occur_time)<=(end_month)*30*24*60*60*1000 && (end_time - item.occur_time+1)>(start_month)*30*24*60*60*1000){
            return true
        }else{
            return false
        }
    })
    const occur_values = occurs.map(occur=>occur.value)
    return sum(occur_values)
}


export default function getMonthsColumns(months){
    if(months===3){
        return [
            {
                title:"0到3个月",
                field:"months0",
                render:rowData =>fmoney(getMonhtsValue(0,3,rowData.occour_times,rowData.end_time),2)
            },
            {
                title:"3到6个月",
                field:"months3",
                render:rowData =>fmoney(getMonhtsValue(3,6,rowData.occour_times,rowData.end_time),2)
            },
            {
                title:"6到12个月",
                field:"months6",
                render:rowData =>fmoney(getMonhtsValue(6,12,rowData.occour_times,rowData.end_time),2)
            },
        ]
        
    }else if(months===4){
        console.log('--4')
        return [
            {
                title:"0到1个月",
                field:"months0",
                render:rowData =>fmoney(getMonhtsValue(0,1,rowData.occour_times,rowData.end_time),2)
            },
            {
                title:"1到3个月",
                field:"months1",
                render:rowData =>fmoney(getMonhtsValue(1,3,rowData.occour_times,rowData.end_time),2)
            },
            {
                title:"3到6个月",
                field:"months3",
                render:rowData =>fmoney(getMonhtsValue(3,6,rowData.occour_times,rowData.end_time),2)
            },
            {
                title:"6到12个月",
                field:"months6",
                render:rowData =>fmoney(getMonhtsValue(6,12,rowData.occour_times,rowData.end_time),2)
            },
        ]
    }else{
        return []
    }
    
}