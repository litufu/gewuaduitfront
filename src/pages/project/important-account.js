import React from 'react';
import MaterialTable from 'material-table';
import gql from 'graphql-tag';
import { navigate } from "@reach/router"
import { useQuery} from '@apollo/react-hooks';
import { Loading,ProjectHeader} from '../../components';
import {companyNature} from '../../constant'
import GET_PROJECTS from '../../graphql/get_projects.query'
import GET_NOT_COMPUTE_TB_SUBJECTS from '../../graphql/get_not_compute_tb_subjects'
import {getImportance,getProjectById,getCompareTb} from '../../compute'
import {fmoney,getCheckEntryData} from '../../utils'

const GET_TB = gql`
  query GetTB($projectId: String!,$type:String!) {
    getTB(projectId: $projectId,type:$type) 
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


export default function ImportantAccount(props) {
  const {projectId} = props

  const { loading, error, data } = useQuery(GET_TB, {
      variables: { projectId ,type:"audited"},
  });
  const { loading:projectLoading, error:projectError, data:projectData } = useQuery(GET_PROJECTS);
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


  if(previousBalanceSheetLoading||loading||previousProfitLoading||notComputeSubjectsLoading||projectLoading||checkEntryLoading) return <Loading />
  if(previousBalanceSheetError||previousProfitError) return <div>{`上期数加载错误，${previousBalanceSheetError.message}`}</div>
  if(error) return <div>{`本期数加载错误，${error.message}`}</div>
  if(notComputeSubjectsError) return <div>{`无需计算科目加载出错，${error.message}`}</div>
  if(projectError) return <div>{`项目信息加载出错，${projectError.message}`}</div>
  if(checkEntryError) return <div>{`抽查凭证出错，${projectError.message}`}</div>

  // -----------获取实际执行的重要性水平--------------
  const tb = JSON.parse(data.getTB)
  const project = getProjectById(props.projectId,projectData.projects)
  const nature = project.company.nature
  const company_nature  = companyNature[nature]
  const importance = getImportance(company_nature,tb)
  const metrologicalBasisValue = importance["metrologicalBasisValue"]
  const overallReportFormLevelRatio = importance["overallReportFormLevelRatio"]
  const overallReportFormLevelValue = parseInt(metrologicalBasisValue*overallReportFormLevelRatio)
  const actualImportanceLevelRatio = importance["actualImportanceLevelRatio"]
  const actualImportanceLevelValue = parseInt(overallReportFormLevelValue*actualImportanceLevelRatio)
  // -----------获取实际执行的重要性水平完毕--------------

    // ---------------分析性程序中获取的重大错报风险账户----------------
    const previousBalanceTB = JSON.parse(previousBalanceSheetData.getPreviousTb)
    const previousProfitTB = JSON.parse(previousProfitData.getPreviousTb)
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

    const riskCompareData = [...newBalanceSheetTbData,...newProfitTbData]
    // -------------------分析性程序中获取的重大错报风险账户完成---------------------------
    // -------------------分录测试开始---------------------------
    const checkEntries = JSON.parse(checkEntryData.getCheckEntry)
    const transactionAmountIsTenThousandData = getCheckEntryData(checkEntries,"交易金额后为整万的分录")
    const notPassPayableToIncomeAccountData = getCheckEntryData(checkEntries,"未通过往来款核算直接计入收入")
    const noneFrequentEventData = getCheckEntryData(checkEntries,"本期发生笔数少于5笔并且具有重要性的业务")
    const notPassPayableToExpenseAccountData = getCheckEntryData(checkEntries,"未通过往来款核算直接计入资产或费用")
    const adjustmentBussinessData = getCheckEntryData(checkEntries,"大额调整凭证") 
    // -------------------分录测试开始---------------------------


  const columns = [
    { title: '项目', field: 'show' },
    { 
      title: '金额', 
      field: 'amount',
      render: rowData=>fmoney(rowData.amount,2)
     },
    { 
        title: '金额重大(大于实际执行重要性水平)', 
        field: 'isBig',
        render:rowData => {
          if(notComputeSubjectsData.getNoComputeTbSubjects.map(s=>s.order).indexOf(rowData.order)!==-1){
            return rowData.amount>actualImportanceLevelValue ? "是" :"否"
          }
        }
    },
    {
      title: '有无重大错报风险',
      field: 'isRisk',
    },
    {
        title: '识别重大账户',
        field: 'isImportant',
        render:rowData =>{
          if(notComputeSubjectsData.getNoComputeTbSubjects.map(s=>s.order).indexOf(rowData.order)!==-1){
            const isBig = rowData.amount>actualImportanceLevelValue
            const isRisk = rowData.isRisk==="有"?true:false
            if(isRisk){
                return "重大账户"
            }else{
                if(isBig){
                    return "非重大账户"
                }else{
                    return "不重大账户"
                }
            }
          }
        }
      },
      {
        title: '存在/发生',
        field: 'exist',
      },
      {
        title: '完整性',
        field: 'completeness',
      },
      {
        title: '权力和义务',
        field: 'powerAndObligation',
      },
      {
        title: '计价和分摊/准确性',
        field: 'accuracy',
      },
      {
        title: '列报',
        field: 'presentation',
      },
      {
        title: '涉及的重大交易流程',
        field: 'process',
        render:rowData =>{
          const isRisk = rowData.isRisk==="有"?true:false
          if(isRisk){
             return `${rowData.subject}流程`
          }
        }
      },
  ]
  const newTbData = tb.filter(data=>Math.abs(data.amount)>0.00).map(data=>{
    const show = data.show
    const amount = data.amount
    const subject = data.subject
    const order = data.order
    if(notComputeSubjectsData.getNoComputeTbSubjects.map(s=>s.order).indexOf(data.order)===-1){
      return {show,amount,subject,order}
    }
    // 分析性程序风险因素
    const newriskCompareDatas = riskCompareData.filter(d=>d.subject===data.subject)
    // 交易金额后为整万的分录

    let isRisk
    let exist
    let completeness
    let accuracy
    // -------------录入分析性程序对认定的影响--------------------
    if(newriskCompareDatas.length>0){
      isRisk = "有"
      const compareItem = newriskCompareDatas[0]
      if(compareItem.lateralChange==="新增" || compareItem.lateralChange>0.3){
        exist = "是"
        accuracy = "是"
      }else{
        completeness = "是"
        accuracy = "是"
      }
    }else{
      isRisk = "无"
      exist = ""
      completeness = ""
      accuracy = ""
    }
    // -------------录入分析性程序对认定的影响--------------------
    // -------------录入凭证抽查程序对认定的影响--------------------
    // 大额整数
    const transactionAmountIsTenThousandDatas = transactionAmountIsTenThousandData.filter(d=>d.subjectName===data.subject)
    // 未通过往来款计入收入
    const notPassPayableToIncomeAccountDatas = notPassPayableToIncomeAccountData.filter(d=>d.subjectName===data.subject)
    // 不经常发生的业务
    const noneFrequentEventDatas = noneFrequentEventData.filter(d=>d.subjectName===data.subject)
    // 不经常发生的费用
    const notPassPayableToExpenseAccountDatas = notPassPayableToExpenseAccountData.filter(d=>d.subjectName===data.subject)
    // 大额调整项目
    const adjustmentBussinessDatas = adjustmentBussinessData.filter(d=>d.subjectName===data.subject)
   
    if(
      (transactionAmountIsTenThousandDatas.length>0)||
      (notPassPayableToIncomeAccountDatas.length>0) ||
      (noneFrequentEventDatas.length>0) ||
      (notPassPayableToExpenseAccountDatas.length>0) ||
      (adjustmentBussinessDatas.length>0)
    ){
      isRisk = "有"
      exist = "是"
      completeness="是"
      accuracy="是"
    }
    // -------------录入凭证抽查程序对认定的影响--------------------
     // -------------收入舞弊假设，重大客户工商信息查询--------------------
     if(["主营业务收入","应收账款","预收款项"].indexOf(data.subject)!==-1){
      isRisk = "有"
      exist = "是"
      completeness="是"
      accuracy="是"
     }
     // -------------收入舞弊假设--------------------
       // -------------重大供应商工商信息查询--------------------
       if(["应付账款"].indexOf(data.subject)!==-1){
        isRisk = "有"
        exist = "是"
        completeness="是"
        accuracy="是"
       }
       // -------------重大供应商工商信息查询--------------------

    return {show,amount,subject,order,isRisk,exist,completeness,accuracy}
  })
  
  return (
    <div>
      <ProjectHeader
        onClick={()=>navigate(`/project/${props.projectId}`)}
        title="重大账户及认定和重大流程评估"
        />
    <MaterialTable
      title={`实际执行的重要性水平：${actualImportanceLevelValue}`}
      columns={columns}
      data={newTbData}
      options={{
        exportButton: true,
        paging: false,
        search:false
      }}
    />
    </div>
  );
}