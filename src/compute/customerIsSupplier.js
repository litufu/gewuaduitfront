
import _ from 'lodash'
import getSubjectDetail from './getSubjectDetail'  

const customer_subjects = ["应收账款","应收帐款","预收账款","预收款项","预收帐款","合同资产","合同负债"]
const supplier_subjects = ["预付账款","预付款项","应付账款","应付帐款"]

export default function customerIsSupplier(auxiliary,subjectBalance){
    const customerSubjectDetail = getSubjectDetail(auxiliary,subjectBalance,customer_subjects)
    const supplierSubjectDetail = getSubjectDetail(auxiliary,subjectBalance,supplier_subjects)

    const customerNames = customerSubjectDetail.map(item=>item.subject_name)
    const supplierNames = supplierSubjectDetail.map(item=>item.subject_name)

    const sameCompanyNames = _.intersection(customerNames,supplierNames)

    return sameCompanyNames
}
