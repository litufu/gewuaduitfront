import { sum } from "../utils"

export default function getSubjectAduitAdjustment(aduitAdjustment,rowData){
    const subjectNum = rowData.subject_num
    const subjectName = rowData.subject_name
    const source = rowData.source
    let subjectAdjustments
    if(source === "kemu"){
        subjectAdjustments = aduitAdjustment.filter(adjust=>{
            if(adjust["subject_num"]===subjectNum){
                return true
            }else{
                return false
            }
        })
        
    }else if(source==="hesuan"){
        subjectAdjustments = aduitAdjustment.filter(adjust=>{
            if(adjust["auxiliary"].indexOf(subjectName)!==-1 && adjust["subject_num"]===subjectNum){
                return true
            }else{
                return false
            }
        })
    }else{
        throw new Error("明细来源不明")
    }

    const debitAdjustments = subjectAdjustments.map(adjust=>adjust["debit"])
    const creditAdjustments = subjectAdjustments.map(adjust=>adjust["credit"])
    return sum(debitAdjustments) - sum(creditAdjustments)

}