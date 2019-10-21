function getFirstSubjectNums(firstSubjectBalance,subjects){
    // 获取科目余额
    const subjectBalance = firstSubjectBalance.filter(balance=>subjects.indexOf(balance.subject_name)!==-1)
    const subjectNums = subjectBalance.map(balance=>balance.subject_num)
    return subjectNums

}

export default function getSubjectDetail(auxiliary,subjectBalance,subjects){
    // 获取一级会计科目
    const firstSubjectBalance = subjectBalance.filter(balance=>(balance.subject_gradation===1))
    // 获取一级会计科目长度
    const firstSubjectlength = firstSubjectBalance[0].subject_num.length
    // 为科目余额表添加一级科目
    const newSubjectBalance = subjectBalance.map(balance=>{
        const firstSubjectNum = balance.subject_num.slice(0,firstSubjectlength)
        return {...balance,firstSubjectNum}
    })
    // 将辅助核算中的部门核算扣除
    const newAuxiliary = auxiliary.filter(item=>item.type_name.indexOf("部门") === -1)
    // 获取科目一级编码
    const subjectNums = getFirstSubjectNums(firstSubjectBalance,subjects)
    if(subjectNums.length>0){
        // 获取科目余额表明细项目
        const detailSubjectBalances = newSubjectBalance.filter(balance=>(
            (balance.is_specific) && (subjectNums.indexOf(balance.firstSubjectNum)!==-1)
        ))
        const detailSubjectNums = detailSubjectBalances.map(balance=>balance.subject_num)
        // 获取辅助核算明细
        const detailAuxiliary = newAuxiliary.filter(item=>detailSubjectNums.indexOf(item.subject_num)!==-1)
        const detailAuxiliarySubjectNums = detailAuxiliary.map(item=>item.subject_num)
        // 从科目余额明细表中扣除辅助核算明细表中相同的会计科目
        const detailSubjectBalancesNew = detailSubjectBalances.filter(balance=>detailAuxiliarySubjectNums.indexOf(balance.subject_num)===-1)
        // 统一科目明细表和辅助核算明细表格式
        const formatDetailSubjectBalances = detailSubjectBalancesNew.map(balance=>({
            subject_num:balance.subject_num,
            subject_name:balance.subject_name,
            direction:balance.direction,
            initial_amount:balance.initial_amount,
            debit_amount:balance.debit_amount,
            credit_amount:balance.credit_amount,
            terminal_amount:balance.terminal_amount,
        }))
        const formatDetailAuxiliary = detailAuxiliary.map(item=>({
            subject_num:item.subject_num,
            subject_name:item.name,
            direction:item.direction,
            initial_amount:item.initial_amount,
            debit_amount:item.debit_amount,
            credit_amount:item.credit_amount,
            terminal_amount:item.terminal_amount,
        }))
        return [...formatDetailSubjectBalances,...formatDetailAuxiliary]
    }else{
        return []
    }
    
}