import _ from 'lodash'

function getSubjectValue(tb,subjectStr){
    for(const item of tb){
        if(_.trim(item.show).startsWith(subjectStr)){
            return item.amount
        }
    }
    return 0.00
}

function computeImportance(company_nature,pre_tax_profit,income,net_assets,total_assets,mini_level){
    let metrological_basis
    let metrological_basis_value
    let overall_report_form_level_ratio
    let actual_importance_level_ratio
    let uncorrected_misstatement

    if(company_nature === "上市公司" || company_nature === "拟上市公司"){
        if(pre_tax_profit * 0.05 > mini_level){
            metrological_basis = "税前利润"
            metrological_basis_value = pre_tax_profit
            overall_report_form_level_ratio = 0.05
        }else if(income * 0.005 > mini_level){
            metrological_basis = "营业收入"
            metrological_basis_value = income
            overall_report_form_level_ratio = 0.005
        }else if(net_assets * 0.01 > mini_level){
            metrological_basis = "净资产"
            metrological_basis_value = net_assets
            overall_report_form_level_ratio = 0.01
        }else if(net_assets * 0.0025 > mini_level){
            metrological_basis = "总资产"
            metrological_basis_value = total_assets
            overall_report_form_level_ratio = 0.0025
        }else{
            metrological_basis = "事务所最低财务报表整体重要性水平"
            metrological_basis_value = mini_level
            overall_report_form_level_ratio = 1
        }
        actual_importance_level_ratio = 0.5
        uncorrected_misstatement = 0.05
    }else if(company_nature === "国有企业"){
        if(pre_tax_profit * 0.06 > mini_level){
            metrological_basis = "税前利润"
            metrological_basis_value = pre_tax_profit
            overall_report_form_level_ratio = 0.06
        }else if(income * 0.0075 > mini_level){
            metrological_basis = "营业收入"
            metrological_basis_value = income
            overall_report_form_level_ratio =  0.0075
        }else if(net_assets * 0.03 > mini_level){
            metrological_basis = "净资产"
            metrological_basis_value = net_assets
            overall_report_form_level_ratio = 0.03
        }else if(net_assets * 0.0035 > mini_level){
            metrological_basis = "总资产"
            metrological_basis_value = total_assets
            overall_report_form_level_ratio = 0.0035
        }else{
            metrological_basis = "事务所最低财务报表整体重要性水平"
            metrological_basis_value = mini_level
            overall_report_form_level_ratio = 1
        }
        actual_importance_level_ratio = 0.75
        uncorrected_misstatement = 0.03
    }else{
        if(pre_tax_profit * 0.08 > mini_level){
            metrological_basis = "税前利润"
            metrological_basis_value = pre_tax_profit
            overall_report_form_level_ratio = 0.08
        }else if(income * 0.01 > mini_level){
            metrological_basis = "营业收入"
            metrological_basis_value = income
            overall_report_form_level_ratio =  0.01
        }else if(net_assets * 0.05 > mini_level){
            metrological_basis = "净资产"
            metrological_basis_value = net_assets
            overall_report_form_level_ratio = 0.05
        }else if(net_assets * 0.005 > mini_level){
            metrological_basis = "总资产"
            metrological_basis_value = total_assets
            overall_report_form_level_ratio = 0.005
        }else{
            metrological_basis = "事务所最低财务报表整体重要性水平"
            metrological_basis_value = mini_level
            overall_report_form_level_ratio = 1
        }
        actual_importance_level_ratio = 0.75
        uncorrected_misstatement = 0.03
    }
        
    const res = {
        "metrologicalBasis":metrological_basis,
        "metrologicalBasisValue":metrological_basis_value,
        "overallReportFormLevelRatio":overall_report_form_level_ratio,
        "actualImportanceLevelRatio":actual_importance_level_ratio,
        "uncorrectedMisstatement":uncorrected_misstatement,
        "companyNature":company_nature
    }
    return res
}

export default function getImportance(companyNature,tb){
    const pre_tax_profit = getSubjectValue(tb,"四、利润总额")
    const income = getSubjectValue(tb,"一、营业总收入")
    const net_assets = getSubjectValue(tb,"股东权益合计")
    const total_assets = getSubjectValue(tb,"资产总计")
    const mini_level = 50000
    const res = computeImportance(companyNature,pre_tax_profit,income,net_assets,total_assets,mini_level)
    return res
}