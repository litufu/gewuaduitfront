import React from 'react';
import MaterialTable from 'material-table';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { navigate } from "@reach/router"
import { Loading,ProjectHeader} from '../../components';
import { Link } from '@reach/router'
import {manuscriptComparison} from '../../constant'
import GET_NOT_COMPUTE_TB_SUBJECTS from '../../graphql/get_not_compute_tb_subjects'
import {getCompareTb,computeDealRisk} from '../../compute'
import {getCheckEntryData} from '../../utils'

const GET_COMPANY_DEAL = gql`
  query getCompanyDeal($projectId: String!,$num:Int!,$type:String!) {
    getCompanyDeal(projectId: $projectId,num:$num,type:$type){
      amount
      name
      company{
        id
        name
        code
        address
        legalRepresentative
        establishDate
        registeredCapital
        businessScope
        holders{
            id
            name
            ratio
        }
        relatedParties{
            id
            grade
            relationship
            type
            name
        }
      }
    }
  }
`;

const GET_TB = gql`
  query GetTB($projectId: String!,$type:String!) {
    getTB(projectId: $projectId,type:$type) 
  }
`;

const GET_PROJECT = gql`
  query Project($projectId: String!) {
    project(projectId: $projectId){
      id
      startTime
    }
  }
`;


const GET_PREVIOUS_TB = gql`
query GetPreviousTb($projectId: String!,$statement:String!) {
  getPreviousTb(projectId: $projectId,statement:$statement) 
}
`;

const GET_CHECK_ENTRY = gql`
  query getCheckEntry($projectId: String!,$ratio:Float,$num:Int,$integerNum:Int,$recompute:String!) {
    getCheckEntry(projectId: $projectId,ratio:$ratio,num:$num,integerNum:$integerNum,recompute:$recompute) 
  }
`;


export default function IdentifiedRisks(props) {
    const {projectId} = props

    const { loading, error, data } = useQuery(GET_TB, {
        variables: { projectId ,type:"audited"},
    });
    const { loading:projectLoading, error:projectError, data:projectData } = useQuery(GET_PROJECT, {
      variables: { projectId},
  });
    const { loading:notComputeSubjectsLoading, error:notComputeSubjectsError, data:notComputeSubjectsData } = useQuery(GET_NOT_COMPUTE_TB_SUBJECTS);
    const { loading:previousBalanceSheetLoading, error:previousBalanceSheetError, data:previousBalanceSheetData } = useQuery(GET_PREVIOUS_TB, {
        variables: { projectId ,statement:"资产负债表"},
    });
    const { loading:previousProfitLoading, error:previousProfitError, data:previousProfitData } = useQuery(GET_PREVIOUS_TB, {
        variables: { projectId ,statement:"利润表"},
    });
    const { loading:checkEntryLoading, error:checkEntryError, data:checkEntryData } = useQuery(GET_CHECK_ENTRY, {
      variables: { projectId:projectId,ratio:0.7,num:5,integerNum:4,recompute:"no" },
    });

    const { loading:customerDealLoading, error:customerDealError, data:customerDealData } = useQuery(GET_COMPANY_DEAL, {
      variables: { projectId:props.projectId ,num:10,type:"customer"},
    });

    const { loading:supplierDealLoading, error:supplierDealError, data:supplierDealData } = useQuery(GET_COMPANY_DEAL, {
      variables: { projectId:props.projectId ,num:10,type:"supplier"},
    });


    
    if(previousBalanceSheetLoading||loading||previousProfitLoading||
      notComputeSubjectsLoading||checkEntryLoading||customerDealLoading||
      supplierDealLoading||projectLoading) return <Loading />
    if(previousBalanceSheetError||previousProfitError) return <div>{`上期数加载错误，${previousBalanceSheetError.message}`}</div>
    if(error) return <div>{`本期数加载错误，${error.message}`}</div>
    if(projectError) return <div>{`项目加载错误，${projectError.message}`}</div>
    if(notComputeSubjectsError) return <div>{`无需计算科目加载出错，${notComputeSubjectsError.message}`}</div>
    if(checkEntryError) return <div>{`抽查凭证错误，${checkEntryError.message}`}</div>
    if(customerDealError) return <div>{`客户交易错误，${customerDealError.message}`}</div>
    if(supplierDealError) return <div>{`供应商交易错误，${supplierDealError.message}`}</div>

    const previousBalanceTB = JSON.parse(previousBalanceSheetData.getPreviousTb)
    const previousProfitTB = JSON.parse(previousProfitData.getPreviousTb)
    const tb = JSON.parse(data.getTB)
    const checkEntries = JSON.parse(checkEntryData.getCheckEntry)
    console.log(projectData)

    // ---------------计算分析性程序存在异常的风险（波动超过30%或新增风险）----------------
    const {tbData:balanceSheetTbData,totalPreviousAmount:totalPreviousBalanceSheetAmount,totalAmount:totalBalanceSheetAmount} = getCompareTb(tb,previousBalanceTB,"资产负债表")
    const {tbData:profitTbData,totalPreviousAmount:totalPreviousProfitAmount,totalAmount:totalProfitAmount} = getCompareTb(tb,previousProfitTB,"利润表")
    const newBalanceSheetTbData = balanceSheetTbData.filter(data=>notComputeSubjectsData.getNoComputeTbSubjects.map(s=>s.order).indexOf(data.order)!==-1).map(data=>{
        const previousAmount = data.previousAmount
        const previousAmountRatio = previousAmount / totalPreviousBalanceSheetAmount
        const amount = data.amount
        const amountRatio = amount / totalBalanceSheetAmount
        const amountChange = amount - previousAmount
        const lateralChange = Math.abs(previousAmount)>0 ? amountChange/previousAmount:"新增"
        const verticalChange = Math.abs(previousAmountRatio)>0 ? (amountRatio-previousAmountRatio)/previousAmountRatio:"新增"
        return {...data,lateralChange,verticalChange}
    }).filter(data=>{
        const lateralChange = data.lateralChange
        const verticalChange = data.verticalChange
        if((lateralChange==="新增")||(verticalChange==="新增")||Math.abs(lateralChange)>0.3||Math.abs(verticalChange)>0.3){
            return true
        }else{
            return false
        }
    })
    const newProfitTbData = profitTbData.filter(data=>notComputeSubjectsData.getNoComputeTbSubjects.map(s=>s.order).indexOf(data.order)!==-1).map(data=>{
        const previousAmount = data.previousAmount
        const previousAmountRatio = previousAmount / totalPreviousProfitAmount
        const amount = data.amount
        const amountRatio = amount / totalProfitAmount
        const amountChange = amount - previousAmount
        const lateralChange = Math.abs(previousAmount)>0 ? amountChange/previousAmount:"新增"
        const verticalChange = Math.abs(previousAmountRatio)>0 ? (amountRatio-previousAmountRatio)/previousAmountRatio:"新增"
        return {...data,lateralChange,verticalChange}
    }).filter(data=>{
        const lateralChange = data.lateralChange
        const verticalChange = data.verticalChange
        if((lateralChange==="新增")||(verticalChange==="新增")||Math.abs(lateralChange)>0.3||Math.abs(verticalChange)>0.3){
            return true
        }else{
            return false
        }
    })

    const balanceCompareData = newBalanceSheetTbData.map(data=>({
        manuscriptName: '资产负债表分析性程序（已审）', 
        risk: `与上期相比变动比例：${typeof(data.lateralChange)==="string"?data.lateralChange:(data.lateralChange*100).toFixed(2)} ${typeof(data.lateralChange)==="string"?"":"%"}`, 
        subjectName:data.subject
    }))

    const profitCompareData = newProfitTbData.map(data=>({
        manuscriptName: '利润表分析性程序（已审）', 
        risk: `与上期相比变动比例：${typeof(data.lateralChange)==="string"?data.lateralChange:(data.lateralChange*100).toFixed(2)} ${typeof(data.lateralChange)==="string"?"":"%"}`, 
        subjectName:data.subject
    }))
    // -------------------计算资产负债表分析性程序和利润表分析性程序完成---------------------------
    // -------------------凭证分析抽查程序开始---------------------------
    const transactionAmountIsTenThousandData = getCheckEntryData(checkEntries,"交易金额后为整万的分录")
    const notPassPayableToIncomeAccountData = getCheckEntryData(checkEntries,"未通过往来款核算直接计入收入")
    const noneFrequentEventData = getCheckEntryData(checkEntries,"本期发生笔数少于5笔并且具有重要性的业务")
    const notPassPayableToExpenseAccountData = getCheckEntryData(checkEntries,"未通过往来款核算直接计入资产或费用")
    const adjustmentBussinessData = getCheckEntryData(checkEntries,"大额调整凭证")
    // -------------------凭证分析抽查程序结束---------------------------
    // ---------------收入舞弊风险假设-----------------------------
    const incomeRiskData = [
      {manuscriptName:"不适用",risk:"收入舞弊假设",subjectName:"主营业务收入"},
      {manuscriptName:"不适用",risk:"收入舞弊假设",subjectName:"应收账款"},
      {manuscriptName:"不适用",risk:"收入舞弊假设",subjectName:"预收款项"}
    ]
    // ---------------收入舞弊风险假设-----------------------------
     // ---------------重要客户工商信息检查-----------------------------
     const customerDealRisksData = computeDealRisk(customerDealData.getCompanyDeal,"customer",projectData.project.startTime)
    // ---------------重要客户工商信息检查-----------------------------
    // ---------------重要供应商工商信息检查-----------------------------
    const supplierDealRiskData =computeDealRisk(supplierDealData.getCompanyDeal,"supplier",projectData.project.startTime)
    // ---------------重要供应商工商信息检查-----------------------------
  
  const riskData =  [
   ...balanceCompareData,
   ...profitCompareData,
   ...transactionAmountIsTenThousandData,
   ...notPassPayableToIncomeAccountData,
   ...noneFrequentEventData,
   ...notPassPayableToExpenseAccountData,
   ...adjustmentBussinessData,
   ...customerDealRisksData,
   ...supplierDealRiskData,
   ...incomeRiskData
  ]

  const columns = [
    { 
        title: '底稿名称', 
        field: 'manuscriptName',
        render: rowData => {
          if(manuscriptComparison.hasOwnProperty(rowData.manuscriptName)){
            return <Link to={`/${manuscriptComparison[rowData.manuscriptName]}/${projectId}`}>{rowData.manuscriptName}</Link>
          }else{
            return <div>{rowData.manuscriptName}</div>
          }
        
        }
    },
    { 
        title: '识别的风险', 
        field: 'risk'
     },
     { 
        title: '影响的会计科目', 
        field: 'subjectName'
     },
  ]

  return (
    <div>
      <ProjectHeader
        onClick={()=>navigate(`/project/${props.projectId}`)}
        title="已识别的风险汇总"
        />
    <MaterialTable
      title="已识别的风险汇总"
      columns={columns}
      data={riskData}
      options={{
        exportButton: true,
        paging: false,
        search:false
      }}
    />
    </div>
  );
}