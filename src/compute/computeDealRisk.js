
function registeredCapitalToNum(registeredCapital){
    if(registeredCapital.indexOf("万元人民币")){
        return parseFloat(registeredCapital.replace("万元人民币",""))*10000
    }else if(registeredCapital.indexOf("亿")){
        return parseFloat(registeredCapital.replace("亿",""))*100000000
    }else if(registeredCapital.indexOf("万美元")){
        return parseFloat(registeredCapital.replace("万美元",""))*70000
    }else{
        const numArr = registeredCapital.match(/\d+/g)
        if(registeredCapital.indexOf("万")){
            return parseFloat(numArr[0])*10000
        }else if(registeredCapital.indexOf("亿")){
            return parseFloat(numArr[0])*100000000
        }else{
            return parseFloat(numArr[0])
        }
        
    }
}

export default function computeDealRisk(deals,type,projectStartTime){
    // 计算成立三年以内，但交易量大于注册资本的公司
    const res = []
    const startTime = new Date(projectStartTime)
    for(let deal of deals){
        const amount = deal.amount
        let registeredCapital
        let iDays
        if(deal.company && deal.company.establishDate){
            const establishDate = new Date(deal.company.establishDate)
            iDays = parseInt(Math.abs(startTime - establishDate ) / 1000 / 60 / 60 /24)
        }
        if(deal.company && deal.company.registeredCapital){
            registeredCapital = registeredCapitalToNum(deal.company.registeredCapital)
        }
        
        if((iDays && iDays<360*3) && (registeredCapital && amount>registeredCapital)){
            if(type==="customer"){
                const item = {manuscriptName:"重要客户工商信息检查",risk:`客户${deal.name}成立时间短,交易规模大,可能存在舞弊风险`,subjectName:"应收账款"}
                res.push(item)
            }else{
                const item = {manuscriptName:"重要供应商工商信息检查",risk:`供应商${deal.name}成立时间短,交易规模大,可能存在舞弊风险`,subjectName:"应付账款"}
                res.push(item)
            }
        }
    }
    return res
}