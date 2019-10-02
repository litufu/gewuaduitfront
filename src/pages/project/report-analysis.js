import React from 'react';
import _ from 'lodash'
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import MaterialTable from 'material-table';
import { navigate } from "@reach/router"
import { Loading,ProjectHeader,MySnackbar} from '../../components';
import {fmoney} from '../../utils'

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

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  button: {
    margin: theme.spacing(1),
  },
}));



export default function ReportAnalysis(props) {
  const classes = useStyles();
  const {statement,audit,projectId} = props
  const { loading:previousLoading, error:previousError, data:previousData } = useQuery(GET_PREVIOUS_TB, {
    variables: { projectId ,statement},
  });
  const type = audit==="未审" ? "unAudited":"audited"
  const { loading, error, data } = useQuery(GET_TB, {
    variables: { projectId ,type},
  });
  
  if(previousLoading||loading) return <Loading />
  if(previousError) return <div>{`上期数加载错误，${previousError.message}`}</div>
  if(error) return <div>{`本期数加载错误，${error.message}`}</div>

  let previousTB
  let tb
  let tbData
  let totalPreviousAmount
  let totalAmount

  try{
    previousTB = JSON.parse(previousData.getPreviousTb)
  }catch(error){
    return <MySnackbar message="未找到上期数据" />
  }

  try{
    tb = JSON.parse(data.getTB)
  }catch(error){
    return <MySnackbar message="未发现本期数据" />
  }

  
  
  if(statement==="资产负债表"){
    const totalLiabilitiesAndShareholdersEquity = tb.filter(item=>_.trim(item.show)==="负债和股东权益总计")
    const previousTotalLiabilitiesAndShareholdersEquity = previousTB.filter(item=>_.trim(item.show)==="负债和股东权益总计")
    if(totalLiabilitiesAndShareholdersEquity.length===0){
      throw new Error("未找到负债和股东权益总计")
    }
    tbData = tb.filter(item=>item.order<=totalLiabilitiesAndShareholdersEquity[0].order).map(data=>{
      const previousData = previousTB.filter(item=>item.order===data.order)
      const previousAmount = previousData[0].amount
      return {...data,previousAmount}
    })
    totalPreviousAmount = previousTotalLiabilitiesAndShareholdersEquity[0].amount
    totalAmount = totalLiabilitiesAndShareholdersEquity[0].amount
  }else if(statement==="利润表"){
    const totalIncome = tb.filter(item=>_.trim(item.show)==="一、营业总收入")
    const previousTotalIncome = previousTB.filter(item=>_.trim(item.show)==="一、营业总收入")
    if(totalIncome.length===0){
      throw new Error("未找到一、营业总收入")
    }
    const netProfit = tb.filter(item=>_.startsWith(_.trim(item.show),"五、净利润"))
    if(netProfit.length===0){
      throw new Error("未找到五、净利润")
    }
    tbData = tb.filter(item=>(item.order<=netProfit[0].order) && (item.order>=totalIncome[0].order)).map(data=>{
      const previousData = previousTB.filter(item=>item.order===data.order)
      const previousAmount = previousData[0].amount
      return {...data,previousAmount}
    })
    totalPreviousAmount = previousTotalIncome[0].amount
    totalAmount = totalIncome[0].amount
  }
  
  const newData=tbData.filter(data=>(Math.abs(data.amount)>0.00)||(Math.abs(data.previousAmount)>0.00))
  const columns = [
    {title: '序号',field: 'order'},
    { title: '科目名称', field: 'show' },
    { title: '方向', field: 'direction' },
    { title: '上期已审数', field: 'previousAmount',render:rowData =>fmoney(rowData.previousAmount,2)},
    { title: '上期比例', field: 'previousAmountRatio',render:rowData =>fmoney(rowData.previousAmount/totalPreviousAmount,2) },
    { title: `本期${audit}数`, field: 'amount' ,render:rowData =>fmoney(rowData.amount,2)},
    { title: `本期比例`, field: 'amountRatio' ,render:rowData =>fmoney(rowData.amount/totalAmount,2)},
    { title: `金额变动`, field: 'amountChange' ,render:rowData =>fmoney(rowData.amount-rowData.previousAmount,2)},
    { title: `横向变动比例`, field: 'lateralChange ' ,render:rowData =>Math.abs(rowData.previousAmount)>0 ? fmoney((rowData.amount-rowData.previousAmount)/rowData.previousAmount,2):"新增"},
    { title: `纵向变动比例`, field: 'verticalChange' ,render:rowData =>Math.abs(rowData.previousAmount/totalPreviousAmount)>0 ? fmoney((rowData.amount/totalAmount-rowData.previousAmount/totalPreviousAmount)/(rowData.previousAmount/totalPreviousAmount),2):"新增"},
    { title: `增减变动原因`, field: 'reason'}
  ]
  return (
    <Paper className={classes.root}>
        <ProjectHeader
         onClick={()=>navigate(`/project/${props.projectId}`)}
         title="报表分析性程序"
        />
        
      <MaterialTable
            title={`${statement}(${audit})`}
            columns={columns}
            data={newData}
            options={{
                exportButton: true,
                paging: false,
              }}
      />
    </Paper>
  );
}