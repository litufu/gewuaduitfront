import React,{useState} from 'react';
import gql from 'graphql-tag';
import { useQuery,useLazyQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import MaterialTable from 'material-table';
import { navigate } from "@reach/router"
import { Link } from '@reach/router'
import { Loading,ProjectHeader} from '../../components';
import {fmoney} from '../../utils'
import Button from '@material-ui/core/Button';

const GET_ENTRY_CLASSIFY = gql`
  query GetEntryClassify($projectId: String!,$recompute:String!) {
    getEntryClassify(projectId: $projectId,recompute:$recompute) 
  }
`;

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  button: {
    margin: theme.spacing(1),
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
  const [getEntryClassify,{ loading:lazyLoading, error:lazyError, data:lazyData }] = useLazyQuery(GET_ENTRY_CLASSIFY);
    
  
  const { loading, error, data } = useQuery(GET_ENTRY_CLASSIFY, {
    variables: { projectId:props.projectId ,recompute:"no"},
  });

  if(loading ||lazyLoading) return <Loading />
  if(error) return <div>{error.message}</div>
  if(lazyError) return <div>{lazyError.message}</div>

  let newData

  if(data && data.getEntryClassify){
    newData = JSON.parse(data.getEntryClassify)
  }

  

  if (lazyData && lazyData.getEntryClassify) {
    newData = JSON.parse(lazyData.getEntryClassify)
  }

  

  const columns = [
    { title: '凭证分类', field: 'desc'},
    { title: '金额', field: 'value',render: rowData =>fmoney(rowData.value,2)  },
    { title: '数量', field: 'number'},
    {
        title: '查看明细',
        field: 'detail',
        render: rowData =><Link 
        to="/entryList"
        state={{ projectId:props.projectId,record: rowData.records}}
        >凭证列表</Link>
    },
  ]
  return (
    <Paper className={classes.root}>
        <ProjectHeader
         onClick={()=>navigate(`/project/${props.projectId}`)}
         title="凭证分类统计"
        />
        <Button 
        variant="contained" 
        href="#contained-buttons" 
        className={classes.button}
        onClick={()=>getEntryClassify({variables: { projectId:props.projectId ,recompute:"yes"}})}
        >
        重新计算
      </Button>
      <MaterialTable
            title="凭证分类统计"
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