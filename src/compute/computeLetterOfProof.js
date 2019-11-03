import _ from 'lodash'

function getStartPoint(sortedItems,type,ratio){
    const sum = _.sumBy(sortedItems,type)
    const stopValue = sum * ratio /100
    let value = 0.00
    for(let item of sortedItems){
        value = value + item[type]
        if(Math.abs(value) >= Math.abs(stopValue)){
            return Math.abs(item[type])
        }
    }
    return 0.00
}

// 计算需要函证的往来款
export default function computeLetterOfProof(accountAge,letterOfProofSetting){
    
    // 销售发生额函证比例
    const customerAmount = letterOfProofSetting.customerAmount
    // 应收预收余额函证比例
    const customerBalance = letterOfProofSetting.customerBalance
    // 采购额函证比例
    const supplierAmount = letterOfProofSetting.supplierAmount
    // 应付预付余额函证比例
    const supplierBalance = letterOfProofSetting.supplierBalance
    // 其他往来余额函证比例
    const otherBalance = letterOfProofSetting.otherBalance
    // 销售测试起点
    const sortedSaleItems = _.orderBy(accountAge.filter(item=>["应收账款","预收款项"].indexOf(item.origin_subject)!==-1), ['debit_amount'], ['desc'])
    const saleStartPoint = getStartPoint(sortedSaleItems,"debit_amount",customerAmount)
    // 应收账款测试起点
    const sortedReceivableItems = _.orderBy(accountAge.filter(
        item=>["应收账款","预收款项"].indexOf(item.origin_subject)!==-1
        ).filter(
         item=>item["terminal_value"]>0
        ), ['terminal_value'], ['desc'])
    const receivableStartPoint = getStartPoint(sortedReceivableItems,"terminal_value",customerBalance)
    // 预收款项测试起点
    const sortedAdvanceReceivableItems = _.orderBy(accountAge.filter(
        item=>["应收账款","预收款项"].indexOf(item.origin_subject)!==-1
        ).filter(
         item=>item["terminal_value"]<0
        ), ['terminal_value'], ['asc'])
    const advanceReceivableStartPoint = getStartPoint(sortedAdvanceReceivableItems,"terminal_value",customerBalance)
    // 采购测试起点
    const sortedPurchaseItems = _.orderBy(accountAge.filter(item=>["应付账款","预付款项"].indexOf(item.origin_subject)!==-1), ['credit_amount'], ['desc'])
    const purchaseStartPoint = getStartPoint(sortedPurchaseItems,"credit_amount",supplierAmount)
    // 应付测试起点
    const sortedPayableItems = _.orderBy(accountAge.filter(
        item=>["应付账款","预付款项"].indexOf(item.origin_subject)!==-1
        ).filter(
         item=>item["terminal_value"]<0
        ), ['terminal_value'], ['asc'])
    const payableStartPoint = getStartPoint(sortedPayableItems,"terminal_value",supplierBalance)
    // 预付测试起点
    const sortedAdvancePayableItems = _.orderBy(accountAge.filter(
        item=>["应付账款","预付款项"].indexOf(item.origin_subject)!==-1
        ).filter(
         item=>item["terminal_value"]>0
        ), ['terminal_value'], ['desc'])
    const advancePayableStartPoint = getStartPoint(sortedAdvancePayableItems,"terminal_value",supplierBalance)
    // 其他应收测试起点
    const sortedOtherReceivableItems = _.orderBy(accountAge.filter(
        item=>["其他应收款","其他应付款"].indexOf(item.origin_subject)!==-1
        ).filter(
         item=>item["terminal_value"]>0
        ), ['terminal_value'], ['desc'])
    const otherReceivableStartPoint =  getStartPoint(sortedOtherReceivableItems,"terminal_value",otherBalance)
    // 其他应付款测试起点
    const sortedOtherPayableItems = _.orderBy(accountAge.filter(
        item=>["其他应收款","其他应付款"].indexOf(item.origin_subject)!==-1
        ).filter(
         item=>item["terminal_value"]<0
        ), ['terminal_value'], ['asc'])
    const otherpayableStartPoint = getStartPoint(sortedOtherPayableItems,"terminal_value",otherBalance)
    // console.log(saleStartPoint,receivableStartPoint,advanceReceivableStartPoint,purchaseStartPoint,payableStartPoint,advancePayableStartPoint,otherReceivableStartPoint,otherpayableStartPoint)
    const newAccountAge = accountAge.map(item=>{
        if(["应收账款","预收款项"].indexOf(item.origin_subject)!==-1){
            if(item.debit_amount>=saleStartPoint){
                return {...item,isLetter:"是",letterReason:"发生额较大"}
            }else{
                if(item.terminal_value>0){
                    if(item.terminal_value>=receivableStartPoint){
                        return {...item,isLetter:"是",letterReason:"余额较大"}
                    }else{
                        return item
                    }
                }else{
                    if(Math.abs(item.terminal_value)>=advanceReceivableStartPoint){
                        return {...item,isLetter:"是",letterReason:"余额较大"}
                    }else{
                        return item
                    }
                }
            }
        }

        if(["应付账款","预付款项"].indexOf(item.origin_subject)!==-1){
            if(item.credit_amount>=purchaseStartPoint){
                return {...item,isLetter:"是",letterReason:"发生额较大"}
            }else{
                if(item.terminal_value>0){
                    if(item.terminal_value>=advancePayableStartPoint){
                        return {...item,isLetter:"是",letterReason:"余额较大"}
                    }else{
                        return item
                    }
                }else{
                    if(Math.abs(item.terminal_value)>=payableStartPoint){
                        return {...item,isLetter:"是",letterReason:"余额较大"}
                    }else{
                        return item
                    }
                }
            }
        }

        if(["其他应付款","其他应收款"].indexOf(item.origin_subject)!==-1){
            if(item.terminal_value>0){
                if(item.terminal_value>=otherReceivableStartPoint){
                    return {...item,isLetter:"是",letterReason:"余额较大"}
                }else{
                    return item
                }
            }else{
                if(Math.abs(item.terminal_value)>=otherpayableStartPoint){
                    return {...item,isLetter:"是",letterReason:"余额较大"}
                }else{
                    return item
                }
            }
        }

        return item

    })

    return newAccountAge

}