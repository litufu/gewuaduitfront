import _ from 'lodash'

export default function getCompareTb(tb,previousTB,statement){
    let tbData
    let totalPreviousAmount
    let totalAmount

    if(statement==="资产负债表"){
        const totalLiabilitiesAndShareholdersEquity = tb.filter(item=>_.trim(item.show)==="负债和股东权益总计")
        const previousTotalLiabilitiesAndShareholdersEquity = previousTB.filter(item=>_.trim(item.show)==="负债和股东权益总计")
        if(totalLiabilitiesAndShareholdersEquity.length===0){
          throw new Error("未找到负债和股东权益总计")
        }
        tbData = tb.filter(item=>item.order<=totalLiabilitiesAndShareholdersEquity[0].order).map(data=>{
          const previousData = previousTB.filter(item=>item.order===data.order)
          const previousAmount = previousData[0].amount
          return {...data,previousAmount}
        })
        totalPreviousAmount = previousTotalLiabilitiesAndShareholdersEquity[0].amount
        totalAmount = totalLiabilitiesAndShareholdersEquity[0].amount
      }else if(statement==="利润表"){
        const totalIncome = tb.filter(item=>_.trim(item.show)==="一、营业总收入")
        const previousTotalIncome = previousTB.filter(item=>_.trim(item.show)==="一、营业总收入")
        if(totalIncome.length===0){
          throw new Error("未找到一、营业总收入")
        }
        const netProfit = tb.filter(item=>_.startsWith(_.trim(item.show),"五、净利润"))
        if(netProfit.length===0){
          throw new Error("未找到五、净利润")
        }
        tbData = tb.filter(item=>(item.order<=netProfit[0].order) && (item.order>=totalIncome[0].order)).map(data=>{
          const previousData = previousTB.filter(item=>item.order===data.order)
          const previousAmount = previousData[0].amount
          return {...data,previousAmount}
        })
        totalPreviousAmount = previousTotalIncome[0].amount
        totalAmount = totalIncome[0].amount
      }
      
      tbData=tbData.filter(data=>(Math.abs(data.amount)>0.00)||(Math.abs(data.previousAmount)>0.00))
      return {tbData,totalPreviousAmount,totalAmount}

}