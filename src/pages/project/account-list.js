

// 原始科目
// 审定科目
// 科目编码
// 单位名称
// 关联方关系
// 单项重大
// 款项性质
// 方向
// 期初金额
// 借方金额
// 贷方金额
// 期末金额
// 未审账龄 【2017年6月，2018年9月】
// 1年以内
// 1-2年
// 2-3年
// 3年以上
// 审计调整
// 1年以内
// 1-2年
// 2-3年
// 3年以上
// 审定数
// 1年以内
// 1-2年
// 2-3年
// 3年以上
// 是否函证
// 期后回款
import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { navigate } from "@reach/router"
import MaterialTable from 'material-table';
import { Loading,ProjectHeader} from '../../components';
import {fmoney} from '../../utils'
import {getYearsColumns,getMonthsColumns} from '../../compute'

const GET_ACCOUNT_AGE = gql`
  query GetAccountAge($projectId: String!) {
    getAccountAge(projectId: $projectId) 
  }
`;

const GET_AGE_SETTING = gql`
  query getAgeSetting($projectId: String!) {
    getAgeSetting(projectId: $projectId) 
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



export default function AccountList(props) {
  const classes = useStyles();
  const { loading:accountAgeLoading, error:accountAgeError, data:accountAgeData } = useQuery(GET_ACCOUNT_AGE, {
    variables: { projectId:props.projectId},
  });
  const { loading:ageSettingLoading, error:ageSettingError, data:ageSettingData } = useQuery(GET_AGE_SETTING, {
    variables: { projectId:props.projectId},
  });

  if(accountAgeLoading ||ageSettingLoading) return <Loading />
  if(accountAgeError) return <div>{accountAgeError.message}</div>
  if(ageSettingError) return <div>{ageSettingError.message}</div>

  const accountAge = JSON.parse(accountAgeData.getAccountAge)
  const ageSetting  = JSON.parse(ageSettingData.getAgeSetting)
  const years = ageSetting.years
  const oneYear = ageSetting.oneYear
  const months = ageSetting.months
  const yearsColumns = getYearsColumns(years)
  let monthsColumns = []
  if(oneYear){
    monthsColumns = getMonthsColumns(parseInt(months))
  }
  
  
  const columns = [
    { title: '原科目名称', field: 'origin_subject' },
    { title: '科目编码', field: 'subject_num' },
    { title: '单位名称', field: 'subject_name'},
    {title: '来源',field: 'source'},
    {title: '截止时间',field: 'end_time'},
    {title: '方向',field: 'direction'},
    {title: '期初数',field: 'initial_amount' , render: rowData =>fmoney(rowData.initial_amount,2) },
    {title: '借方发生额',field: 'debit_amount' , render: rowData =>fmoney(rowData.debit_amount,2) },
    {title: '贷方发生额',field: 'credit_amount' , render: rowData =>fmoney(rowData.credit_amount,2) },
    {title: '期末数',field: 'terminal_amount' , render: rowData =>fmoney(rowData.terminal_amount,2) },
    {title: '发生时间',field: 'occour_times'},
    ...monthsColumns,
    ...yearsColumns,
    
  ]
  return (
        <Paper className={classes.root}>
        <ProjectHeader
        onClick={()=>navigate(`/project/${props.projectId}`)}
        title="往来款明细"
        />
        <MaterialTable
            title="往来"
            columns={columns}
            data={accountAge}
            options={{
                exportButton: true,
                paging: false,
              }}
      />
    </Paper>
    
  );
}

