import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
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

const GET_PREVIOUS_SUBJECT_BALANCE = gql`
  query GetPreviousSubjectBalance($projectId: String!) {
    getPreviousSubjectBalance(projectId: $projectId) 
  }
`;


const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

export default function CompareThisStartToLastEnd(props) {
  const classes = useStyles();

  const { loading:subjectLoading, error:subjectError, data:subjectData } = useQuery(GET_SUBJECT_BALANCE, {
    variables: { projectId:props.projectId },
  });
  const { loading:previousLoading, error:previousError, data:previousData } = useQuery(GET_PREVIOUS_SUBJECT_BALANCE, {
    variables: { projectId:props.projectId },
  });
  

  if(subjectLoading||previousLoading) return <Loading />
  if(subjectError) return <div>{subjectError.message}</div>
  if(previousError) return <div>{previousError.message}</div>

  
  const subjectBalances = JSON.parse(subjectData.getSubjectBalance)
  const preVioussubjectBalances = JSON.parse(previousData.getPreviousSubjectBalance)

  const data = subjectBalances.map(subjectBalance=>{
    const previousSubjects = preVioussubjectBalances.filter(previous=>previous.subject_num===subjectBalance.subject_num)
      if(previousSubjects.length>0){
          return {
            subject_num:subjectBalance.subject_num,
            subject_name:subjectBalance.subject_name,
            initial_amount:subjectBalance.initial_amount,
            terminal_amount:previousSubjects[0].terminal_amount,
          }
      }else{
          return {
            subject_num:subjectBalance.subject_num,
            subject_name:subjectBalance.subject_name,
            initial_amount:subjectBalance.initial_amount,
            terminal_amount:0.00,
          }
      }
  })

  const columns = [
    { title: '科目编码', field: 'subject_num'},
    { title: '科目名称', field: 'subject_name' },
    {title: '本期初',field: 'initial_amount', render: rowData =>fmoney(rowData.initial_amount,2)},
    {title: '上期末',field: 'terminal_amount', render: rowData =>fmoney(rowData.terminal_amount,2)},
    {title: '差额',field: 'Diff' , render: rowData =>fmoney(rowData.initial_amount-rowData.terminal_amount,2) },
  ]
  return (
    <div className={classes.root}>
        <ProjectHeader
         onClick={()=>navigate(`/project/${props.projectId}`)}
         title="期初数与上期末数比较"
        />
    
      <MaterialTable
            title="期初数与上期末数比较"
            columns={columns}
            data={data}
            options={{
                exportButton: true,
                paging: false,
              }}
      />
     
    </div>
  );
}