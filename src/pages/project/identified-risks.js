import React from 'react';
import MaterialTable from 'material-table';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { navigate } from "@reach/router"
import { Loading,ProjectHeader} from '../../components';
import { Link } from '@reach/router'
import {manuscriptComparison} from '../../constant'
import GET_NOT_COMPUTE_TB_SUBJECTS from '../../graphql/get_not_compute_tb_subjects'
import {getCompareTb} from '../../compute'

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

export default function IdentifiedRisks(props) {
    const {projectId} = props

    // ---------------计算分析性程序存在异常的风险（波动超过30%或新增风险）----------------
    const { loading, error, data } = useQuery(GET_TB, {
        variables: { projectId ,type:"audited"},
    });
    const { loading:notComputeSubjectsLoading, error:notComputeSubjectsError, data:notComputeSubjectsData } = useQuery(GET_NOT_COMPUTE_TB_SUBJECTS);
    const { loading:previousBalanceSheetLoading, error:previousBalanceSheetError, data:previousBalanceSheetData } = useQuery(GET_PREVIOUS_TB, {
        variables: { projectId ,statement:"资产负债表"},
    });
    const { loading:previousProfitLoading, error:previousProfitError, data:previousProfitData } = useQuery(GET_PREVIOUS_TB, {
        variables: { projectId ,statement:"利润表"},
    });
    
    
    if(previousBalanceSheetLoading||loading||previousProfitLoading||notComputeSubjectsLoading) return <Loading />
    if(previousBalanceSheetError||previousProfitError) return <div>{`上期数加载错误，${previousBalanceSheetError.message}`}</div>
    if(error) return <div>{`本期数加载错误，${error.message}`}</div>
    if(notComputeSubjectsError) return <div>{`无需计算科目加载出错，${error.message}`}</div>

    const previousBalanceTB = JSON.parse(previousBalanceSheetData.getPreviousTb)
    const previousProfitTB = JSON.parse(previousProfitData.getPreviousTb)
    const tb = JSON.parse(data.getTB)

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

    

  
  const riskData =  [
   ...balanceCompareData,
   ...profitCompareData
  ]

  const columns = [
    { 
        title: '底稿名称', 
        field: 'manuscriptName',
        render: rowData => <Link to={`/${manuscriptComparison[rowData.manuscriptName]}/${projectId}`}>{rowData.manuscriptName}</Link>
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