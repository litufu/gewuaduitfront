import React from 'react';
import _ from 'lodash'
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Loading,ProjectHeader} from '../../components';
import { navigate } from "@reach/router"
import MaterialTable from 'material-table';
import {fmoney} from '../../utils'

const GET_SUBJECT_BALANCE = gql`
  query GetSubjectBalance($projectId: String!) {
    getSubjectBalance(projectId: $projectId) 
  }
`;

const GET_CHRONOLOGICAL_ACCOUNT_PIVOT = gql`
  query GetChronologicalAccountPivot($projectId: String!) {
    getChronologicalAccountPivot(projectId: $projectId) 
  }
`;



const GET_AUXILIARIES = gql`
  query getAuxiliaries($projectId: String!) {
    getAuxiliaries(projectId: $projectId) 
  }
`;



const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});



export default function CheckProject(props) {
  const classes = useStyles();

  const { loading:subjectLoading, error:subjectError, data:subjectData } = useQuery(GET_SUBJECT_BALANCE, {
    variables: { projectId:props.projectId },
  });
  const { loading:chronologicalLoading, error:chronologicalError, data:chronologicalData } = useQuery(GET_CHRONOLOGICAL_ACCOUNT_PIVOT, {
    variables: { projectId:props.projectId },
  });
  const { loading:auxiliaryLoading, error:auxiliaryError, data:auxiliaryData } = useQuery(GET_AUXILIARIES, {
    variables: { projectId:props.projectId },
  });

  if(subjectLoading||chronologicalLoading||auxiliaryLoading) return <Loading />
  if(subjectError) return <div>{subjectError.message}</div>
  if(chronologicalError) return <div>{chronologicalError.message}</div>
  if(auxiliaryError) return <div>{auxiliaryError.message}</div>

  
  const subjectBalances = JSON.parse(subjectData.getSubjectBalance)
  const chronologicalAccounts = JSON.parse(chronologicalData.getChronologicalAccountPivot)
  const auxiliaries = JSON.parse(auxiliaryData.getAuxiliaries)

  const data1 = chronologicalAccounts.map(chronologicalAccount=>{
    const subjects = subjectBalances.filter(subjectBalance=>subjectBalance.subject_num===chronologicalAccount.subject_num)
    if(subjects.length===1){
      return {
        subject_num:chronologicalAccount.subject_num,
        subject_name:subjects[0].subject_name,
        debit_amount:subjects[0].debit_amount,
        credit_amount:subjects[0].credit_amount,
        debit:chronologicalAccount.debit,
        credit:chronologicalAccount.credit,
      }
    }else{
      return {
        subject_num:chronologicalAccount.subject_num,
        subject_name:"",
        debit_amount:0.00,
        credit_amount:0.00,
        debit:chronologicalAccount.debit,
        credit:chronologicalAccount.credit,
      }
    }
  })

  const groupedAuxiliaries = _.groupBy(auxiliaries,"subject_num")
  const data2 = []
  for(let subject_num in groupedAuxiliaries){
    let type_name_objs = _.groupBy(groupedAuxiliaries[subject_num],"type_name")
    const subjects = subjectBalances.filter(subjectBalance=>subjectBalance.subject_num===subject_num)
    for(let type_name in type_name_objs){
      const d = {
        subject_num,
        type_name,
        initial_amount:_.sumBy(type_name_objs[type_name],"initial_amount"),
        debit_amount:_.sumBy(type_name_objs[type_name],"debit_amount"),
        credit_amount:_.sumBy(type_name_objs[type_name],"credit_amount"),
        terminal_amount:_.sumBy(type_name_objs[type_name],"terminal_amount"),
        initial:subjects[0].initial_amount,
        debit:subjects[0].debit_amount,
        credit:subjects[0].credit_amount,
        terminal:subjects[0].terminal_amount,
      }
      data2.push(d)
    }
  }
  console.log(data2)
  const columns2 = [
    { title: '科目编码', field: 'subject_num'},
    { title: '核算项目', field: 'type_name' },
    {title: '期初-核算',field: 'initial_amount', render: rowData =>fmoney(rowData.initial_amount,2)},
    {title: '借方-核算',field: 'debit_amount', render: rowData =>fmoney(rowData.debit_amount,2)},
    {title: '贷方-核算',field: 'credit_amount' , render: rowData =>fmoney(rowData.credit_amount,2) },
    {title: '期末-核算',field: 'terminal_amount' , render: rowData =>fmoney(rowData.terminal_amount,2) },
    {title: '期初-科目',field: 'initial', render: rowData =>fmoney(rowData.initial,2)},
    {title: '借方-科目',field: 'debit', render: rowData =>fmoney(rowData.debit,2)},
    {title: '贷方-科目',field: 'credit' , render: rowData =>fmoney(rowData.credit,2) },
    {title: '期末-科目',field: 'terminal' , render: rowData =>fmoney(rowData.terminal,2) },
    {title: '期初差额',field: 'initialDiff' , render: rowData =>fmoney(rowData.initial_amount-rowData.initial,2) },
    {title: '借方差额',field: 'debitDiff' , render: rowData =>fmoney(rowData.debit_amount-rowData.debit,2) },
    {title: '贷方差额',field: 'creditDiff' , render: rowData =>fmoney(rowData.credit_amount-rowData.credit,2) },
    {title: '期末差额',field: 'terminalDiff' , render: rowData =>fmoney(rowData.terminal_amount-rowData.terminal,2) },

  ]
  const columns1 = [
    { title: '科目编码', field: 'subject_num'},
    { title: '科目名称', field: 'subject_name' },
    {title: '借方-科目余额表',field: 'debit_amount', render: rowData =>fmoney(rowData.debit_amount,2)},
    {title: '贷方-科目余额表',field: 'credit_amount', render: rowData =>fmoney(rowData.credit_amount,2)},
    {title: '借方-序时账',field: 'debit' , render: rowData =>fmoney(rowData.debit,2) },
    {title: '贷方-序时账',field: 'credit' , render: rowData =>fmoney(rowData.credit,2) },
    {title: '借方差额',field: 'debitDiff' , render: rowData =>fmoney(rowData.debit_amount-rowData.debit,2) },
    {title: '贷方差额',field: 'creditDiff' , render: rowData =>fmoney(rowData.credit_amount-rowData.credit,2) },
  ]
  return (
    <div className={classes.root}>
        <ProjectHeader
         onClick={()=>navigate(`/project/${props.projectId}`)}
         title="账务检查"
        />
      <Typography variant="h6" gutterBottom>
        审核内容：
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        1、检查导入的科目余额表与序时账数据是否一致
      </Typography>
      <MaterialTable
            title="科目余额表与序时账核对"
            columns={columns1}
            data={data1}
            options={{
                exportButton: true,
                paging: false,
              }}
      />
      <Typography variant="subtitle2" gutterBottom>
        2、检查导入的辅助核算明细表与科目余额表是否一致
      </Typography>
      <MaterialTable
            title="科目余额表与序时账核对"
            columns={columns2}
            data={data2}
            options={{
                exportButton: true,
                paging: false,
              }}
      />
    </div>
  );
}