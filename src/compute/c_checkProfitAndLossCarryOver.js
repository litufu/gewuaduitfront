import {checkExistSubjects} from '../constant'

function checkExist(subjectbalances,subjectName){
    const subjects = subjectbalances.filter(subjectBalance=>{
        if(subjectBalance.subject_name===subjectName){
            return true
        }
        return false
    })
    if(subjects.length>0){
        return true
    }else{
        return false
    }

}

export default function checkProfitAndLossCarryOver(subjectbalances){
    const res = []
     for(const subjectName of checkExistSubjects){
         const isExist = checkExist(subjectbalances,subjectName)
         const result = isExist ? "存在" : "不存在"
         res.push({"content":`检查${subjectName}科目是否存在`,result})
     }
     return res
}