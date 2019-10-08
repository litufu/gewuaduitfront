import React from 'react';
import gql from 'graphql-tag';
import { navigate } from "@reach/router"
import { useQuery,useLazyQuery } from '@apollo/react-hooks';
import { Loading,ProjectHeader} from '../../components';
import Typography from '@material-ui/core/Typography';
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import {fmoney} from '../../utils'

const GET_CHECK_ENTRY = gql`
  query getCheckEntry($projectId: String!,$ratio:Float,$num:Int,$integerNum:Int,$recompute:String!) {
    getCheckEntry(projectId: $projectId,ratio:$ratio,num:$num,integerNum:$integerNum,recompute:$recompute) 
  }
`;

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
      },
      button: {
        margin: theme.spacing(1),
      },
}))


export default function CheckEntry(props) {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_CHECK_ENTRY, {
    variables: { projectId:props.projectId,ratio:0.7,num:5,integerNum:4,recompute:"no" },
  });
  const [getCheckEntry,{ loading:LazyLoading, error:LazyError, data:LazyData }] = useLazyQuery(GET_CHECK_ENTRY);

  if(loading||LazyLoading) return <Loading />
  if(error) return <div>{error.message}</div>
  if(LazyError) return <div>{LazyError.message}</div>

  let newData
  if(data && data.getCheckEntry){
    newData = JSON.parse(data.getCheckEntry)
  }
  if(LazyData && LazyData.getCheckEntry){
    newData = JSON.parse(data.getCheckEntry)
  }
  
  const columns = [
    { title: '抽查原因', field: 'check_reason' },
    { title: '月份', field: 'month' },
    { title: '凭证种类', field: 'vocher_type' },
    { title: '凭证号', field: 'vocher_num' },
    { title: '摘要', field: 'description' },
    { title: '科目编码', field: 'subject_num' },
    { title: '科目名称', field: 'subject_name' },
    { title: '一级名称', field: 'tb_subject' },
    { title: '借方发生额', field: 'debit', render: rowData =>fmoney(rowData.debit,2) },
    { title: '贷方发生额', field: 'debit', render: rowData =>fmoney(rowData.credit,2) },
    { title: '辅助核算', field: 'auxiliary' },
    { title: '内容1', field: 'content1' },
    { title: '内容2', field: 'content2' },
    { title: '内容3', field: 'content3' },
    { title: '内容4', field: 'content4' },

  ]

  return (
    <div className={classes.root}>
        <ProjectHeader
         onClick={()=>navigate(`/project/${props.projectId}`)}
         title="凭证抽查表"
        />
    <Typography variant="h6" gutterBottom>
        分录抽查测试参数说明：
      </Typography>
      <Typography variant="body1" gutterBottom>
        起测点：实际执行重要性水平的70%
      </Typography>
      <Typography variant="body1" gutterBottom>
        整数交易：尾数为4个0000的交易
      </Typography>
      <Typography variant="body1" gutterBottom>
        非经常业务：发生笔数在5笔及以下
      </Typography>
      <Button 
      color="primary" 
      className={classes.button}
      onClick={()=>getCheckEntry({variables:{projectId:props.projectId,ratio:0.7,num:5,integerNum:4,recompute:"yes"}})}
      >
            重新抽查
        </Button>
      <MaterialTable
      title="抽查凭证"
      columns={columns}
      data={newData}
      options={{
        exportButton: true,
        paging: false,
      }}
    />
    <Divider />
    <Typography variant="h6" gutterBottom>
        测试内容：
      </Typography>
      <Typography variant="body1" gutterBottom>
        内容1：检查会计处理是否符合企业会计准则的要求
      </Typography>
      <Typography variant="body1" gutterBottom>
        内容2：检查凭证记录是否与原始凭证一致
      </Typography>
      <Typography variant="body1" gutterBottom>
        内容3：原始凭证是否齐全、真实
      </Typography>
    </div>
  );
}