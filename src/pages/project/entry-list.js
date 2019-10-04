import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { navigate } from "@reach/router"
import MaterialTable from 'material-table';
import { Loading,ProjectHeader} from '../../components';
import {fmoney} from '../../utils'

const GET_CHRONOLOGICAL_ACCOUNT_BY_ENTRY_NUMS = gql`
  query GetChronologicalAccountByEntryNums($projectId: String!,$record:String!) {
    getChronologicalAccountByEntryNums(projectId: $projectId,record:$record) 
  }
`;

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 800,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));



export default function EntryList({location}) {
    console.log(location)
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_CHRONOLOGICAL_ACCOUNT_BY_ENTRY_NUMS, {
    variables: { projectId:location.state.projectId,record:location.state.record},
  });

  if(loading) return <Loading />
  if(error) return <div>{error.message}</div>

  const newData = JSON.parse(data.getChronologicalAccountByEntryNums)
  const columns = [
    { title: '年度', field: 'year' },
    { title: '月', field: 'month' },
    { title: '凭证种类', field: 'vocher_type'},
    {title: '凭证号',field: 'vocher_num'},
    {title: '分录号',field: 'subentry_num'},
    {title: '摘要',field: 'description'},
    {title: '科目编码',field: 'subject_num'},
    {title: '科目名称',field: 'subject_name'},
    {title: '借方发生额',field: 'debit' , render: rowData =>fmoney(rowData.debit,2) },
    {title: '贷方发生额',field: 'credit', render: rowData =>fmoney(rowData.credit,2)},
    {title: '辅助核算',field: 'auxiliary'},
  ]
  return (
        <Paper className={classes.root}>
        <ProjectHeader
        onClick={()=>navigate(`/entryClassify/${location.state.projectId}`)}
        title="凭证明细"
        />
        <MaterialTable
            title="凭证明细"
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