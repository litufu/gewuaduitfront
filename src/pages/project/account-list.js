

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
import {getYearsColumns,getMonthsColumns,getSubjectAduitAdjustment,computeLetterOfProof} from '../../compute'

const GET_ADUIT_ADJUSTMENTS = gql`
  query GetAduitAdjustments($projectId: String!) {
    getAduitAdjustments(projectId: $projectId) 
  }
`;

const GET_ACCOUNT_AGE = gql`
  query GetAccountAge($projectId: String!) {
    getAccountAge(projectId: $projectId) 
  }
`;

const GET_LETTER_OF_PROOF_SETTING = gql`
  query GetLetterOfProofSetting($projectId: String!) {
    getLetterOfProofSetting(projectId: $projectId) 
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
    // overflowX: 'auto',
  },
  table: {
    minWidth: 800,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const more_than_zero_match_subjects = {
  "应收账款":"应收账款",
  "预收款项":"应收账款",
  "预付款项":"预付款项",
  "应付账款":"预付款项",
  "其他应收款":"其他应收款",
  "其他应付款":"其他应收款",
  "合同资产":"合同资产",
  "合同负债":"合同资产",
}

const less_than_zero_match_subjects = {
  "应收账款":"预收款项",
  "预收款项":"预收款项",
  "预付款项":"应付账款",
  "应付账款":"应付账款",
  "其他应收款":"其他应付款",
  "其他应付款":"其他应付款",
  "合同资产":"合同负债",
  "合同负债":"合同负债",
}

export default function AccountList(props) {
  const classes = useStyles();
  const { loading:aduitLoading, error:aduitError, data:aduitData } = useQuery(GET_ADUIT_ADJUSTMENTS, {
    variables: { projectId:props.projectId },
  });
  const { loading:accountAgeLoading, error:accountAgeError, data:accountAgeData } = useQuery(GET_ACCOUNT_AGE, {
    variables: { projectId:props.projectId},
  });
  const { loading:letterOfProofSettingLoading, error:letterOfProofSettingError, data:letterOfProofSettingData } = useQuery(GET_LETTER_OF_PROOF_SETTING, {
    variables: { projectId:props.projectId },
  });
  const { loading:ageSettingLoading, error:ageSettingError, data:ageSettingData } = useQuery(GET_AGE_SETTING, {
    variables: { projectId:props.projectId},
  });

  if(accountAgeLoading ||ageSettingLoading||aduitLoading||letterOfProofSettingLoading) return <Loading />
  if(accountAgeError) return <div>{accountAgeError.message}</div>
  if(ageSettingError) return <div>{ageSettingError.message}</div>
  if(aduitError) return <div>{aduitError.message}</div>
  if(letterOfProofSettingError) return <div>{letterOfProofSettingError.message}</div>

  const accountAge = JSON.parse(accountAgeData.getAccountAge)
  const ageSetting  = JSON.parse(ageSettingData.getAgeSetting)
  const letterOfProofSetting  = JSON.parse(letterOfProofSettingData.getLetterOfProofSetting)
  const aduitAdjustment = JSON.parse(aduitData.getAduitAdjustments)
  const newAccountAgeData = computeLetterOfProof(accountAge,letterOfProofSetting)

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
    // {title: '来源',field: 'source'},
    // {title: '截止时间',field: 'end_time'},
    {title: '方向',field: 'direction'},
    {title: '期初数',field: 'initial_amount' , render: rowData =>fmoney(rowData.initial_amount,2) },
    {title: '借方发生额',field: 'origin_debit' , render: rowData =>fmoney(rowData.origin_debit,2) },
    {title: '贷方发生额',field: 'origin_credit' , render: rowData =>fmoney(rowData.origin_credit,2) },
    {title: '期末数',field: 'origin_terminal' , render: rowData =>fmoney(rowData.origin_terminal,2) },
    {title: '期末价值',field: 'origin_terminal_value' , render: rowData =>fmoney(rowData.origin_terminal_value,2) },
    {title: '审计调整',field: 'adjustment', render: rowData =>fmoney(getSubjectAduitAdjustment(aduitAdjustment,rowData),2) },
    {title: '审定价值',field: 'approval',render: rowData =>fmoney((rowData.origin_terminal_value+getSubjectAduitAdjustment(aduitAdjustment,rowData)),2) },
    {title: '期末审定价值',field: 'terminal_value' , render: rowData =>fmoney(rowData.terminal_value,2) },
    ...monthsColumns,
    ...yearsColumns,
    {title: '审定科目名称',field: 'approval_subject',render:rowData=>{
      const value = rowData.terminal_value+getSubjectAduitAdjustment(aduitAdjustment,rowData)
      if(value>0){
        return more_than_zero_match_subjects[rowData.origin_subject]
      }else if(value<0){
        return less_than_zero_match_subjects[rowData.origin_subject]
      }else{
        return rowData.origin_subject
      }
    } },
    {title: '是否函证',field: 'isLetter'},
    {title: '函证原因',field: 'letterReason'},
    // {title: '发生时间',field: 'occour_times'},
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
            data={newAccountAgeData}
            options={{
                exportButton: true,
                paging: false,
                doubleHorizontalScroll:true,
              }}
      />
    </Paper>
    
  );
}

