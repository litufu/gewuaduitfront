import React,{useState} from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import MaterialTable from 'material-table';
import { navigate } from "@reach/router"
import { Link } from '@reach/router'
import { Loading,ProjectHeader} from '../../components';
import {fmoney} from '../../utils'

const GET_SUBJECT_BALANCE = gql`
  query GetSubjectBalance($projectId: String!) {
    getSubjectBalance(projectId: $projectId) 
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
}));



export default function SujbectBalance(props) {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_SUBJECT_BALANCE, {
    variables: { projectId:props.projectId },
  });

  if(loading) return <Loading />
  if(error) return <div>{error.message}</div>

  const newData = JSON.parse(data.getSubjectBalance)
  const treeData = newData.map(row=>{
      const subjectNumLength = row.subject_num.length
      if(subjectNumLength>4){
          const parentSubjectNum = row.subject_num.slice(0,subjectNumLength-2)
          return {...row,parentSubjectNum}
      }else{
          return row
      }
  })
  const columns = [
    { title: '科目编码', field: 'subjectNum' ,render: rowData =><Link 
    to="/chronologicalAccount"
    state={{ subjectNum: rowData.subject_num,projectId:props.projectId,grade:rowData.subject_gradation }}
    >{rowData.subject_num}</Link>},
    { title: '科目名称', field: 'subject_name' },
    { title: '科目类型', field: 'subject_type'},
    {title: '借贷方向',field: 'direction'},
    {title: '科目级别',field: 'subject_gradation'},
    {title: '期初余额',field: 'initial_amount', render: rowData =>fmoney(rowData.initial_amount,2)},
    {title: '借方发生额',field: 'debit_amount', render: rowData =>fmoney(rowData.debit_amount,2)},
    {title: '贷方发生额',field: 'credit_amount', render: rowData =>fmoney(rowData.credit_amount,2)},
    {title: '期末余额',field: 'terminal_amount' , render: rowData =>fmoney(rowData.terminal_amount,2) },
  ]
  return (
    <Paper className={classes.root}>
        <ProjectHeader
         onClick={()=>navigate(`/project/${props.projectId}`)}
         title="科目余额表"
        />
      <MaterialTable
            title="科目余额表"
            columns={columns}
            data={treeData}
            parentChildData={(row, rows) => rows.find(a => a.subject_num === row.parentSubjectNum)}
            options={{
                exportButton: true,
                paging: false,
              }}
      />
    </Paper>
  );
}