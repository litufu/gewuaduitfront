
import _ from 'lodash'
import getSubjectDetail from './getSubjectDetail'  

const accounts_receivable = ["应收账款","应收帐款"]
const advance_account_receivable = ["预收账款","预收款项","预收帐款"]
const contractual_assets = ["合同资产"]
const contractual_liability = ["合同负债"]
const advance_payment = ["预付账款","预付款项"]
const accounts_payable = ["应付账款","应付帐款"]


export default function hasTwosubjectsCompanies(auxiliary,subjectBalance){
    const accountsReceivable = getSubjectDetail(auxiliary,subjectBalance,accounts_receivable)
    const advanceAccountReceivable = getSubjectDetail(auxiliary,subjectBalance,advance_account_receivable)
    const contractualAssets = getSubjectDetail(auxiliary,subjectBalance,contractual_assets)
    const contractualLiability = getSubjectDetail(auxiliary,subjectBalance,contractual_liability)
    const advancePayment = getSubjectDetail(auxiliary,subjectBalance,advance_payment)
    const accountsPayable = getSubjectDetail(auxiliary,subjectBalance,accounts_payable)

    const accountsReceivableSubjectNames = accountsReceivable.map(item=>item.subject_name)
    const advanceAccountReceivableSubjectNames = advanceAccountReceivable.map(item=>item.subject_name)
    const contractualAssetsNames = contractualAssets.map(item=>item.subject_name)
    const contractualLiabilityNames = contractualLiability.map(item=>item.subject_name)
    const advancePaymentSubjectNames = advancePayment.map(item=>item.subject_name)
    const accountsPayableNames = accountsPayable.map(item=>item.subject_name)

    const receivable = _.intersection(accountsReceivableSubjectNames,advanceAccountReceivableSubjectNames)
    const payable = _.intersection(advancePaymentSubjectNames,accountsPayableNames)
    const contractual = _.intersection(contractualAssetsNames,contractualLiabilityNames)

    return {receivable,payable,contractual}





}