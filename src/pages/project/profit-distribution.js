import React from 'react';
import _ from 'lodash'
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MaterialTable from 'material-table';
import { navigate } from "@reach/router"
import { Loading,ProjectHeader} from '../../components';
import {fmoney} from '../../utils'

const GET_SUBJECT_BALANCE = gql`
  query GetSubjectBalance($projectId: String!) {
    getSubjectBalance(projectId: $projectId) 
  }
`;

const GET_PROFIT_ADJUSTMENT = gql`
  query getProfitAdjustment($projectId: String!) {
    getProfitAdjustment(projectId: $projectId) 
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

  export default function ProfitDistibution(props) {
    const classes = useStyles();
    const { loading:subjectLoading, error:subjectError, data:subjectData } = useQuery(GET_SUBJECT_BALANCE, {
      variables: { projectId:props.projectId },
    });
    const { loading:adjustmentLoading, error:adjustmentError, data:adjustmentData } = useQuery(GET_PROFIT_ADJUSTMENT, {
        variables: { projectId:props.projectId },
      });
  
    if(subjectLoading||adjustmentLoading) return <Loading />
    if(subjectError) return <div>{subjectError.message}</div>
    if(adjustmentError) return <div>{adjustmentError.message}</div>


  
    const subjectBalances = JSON.parse(subjectData.getSubjectBalance)
    const adjustments = JSON.parse(adjustmentData.getProfitAdjustment)

    const initials = subjectBalances.filter(subjectBalance=>{
        if(subjectBalance.subject_name==="利润分配" && subjectBalance.subject_gradation===1){
            return true
        }else if(subjectBalance.subject_name==="利润分配" && subjectBalance.subject_gradation===1 && Math.abs(subjectBalance.initial_amount)>0.00001){
            return true
        }else if(subjectBalance.subject_name.startsWith("6") && subjectBalance.is_specific==="True" && Math.abs(subjectBalance.initial_amount)>0.00001){
            return true
        }else{
            return false
        }
    })
    const initial_itmes = initials.map(initial=>{
        if(initial.direction==="借"){
            return {subject_name:initial.subject_name,amount:-initial.initial_amount}
        }else{
            return {subject_name:initial.subject_name,amount:initial.initial_amount}
        }
    })
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
      <div className={classes.root}>
          <ProjectHeader
           onClick={()=>navigate(`/project/${props.projectId}`)}
           title="期初未分配利润调整明细"
          />
          <List>
          {
              initial_itmes.map(initial_item=>(
                  <ListItem key={initial_item.subject_name}>
                      {`${initial_item.subject_name} : ${fmoney(initial_item.amount,2)}`}
                  </ListItem>
              ))
          }
          <ListItem>
              {`期初未分配利润合计：${fmoney(_.sumBy(initial_itmes,"amount"),2)}`}
          </ListItem>
          <ListItem>
              {`期初调整数合计：${fmoney((_.sumBy(adjustments,"debit")-_.sumBy(adjustments,"credit")),2)}`}
          </ListItem>
          <ListItem>
              {`审定期初数：${fmoney((_.sumBy(initial_itmes,"amount") + _.sumBy(adjustments,"debit")-_.sumBy(adjustments,"credit")),2)}`}
          </ListItem>
          </List>
        <MaterialTable
              title="期初未分配利润调整明细"
              columns={columns}
              data={adjustments}
              options={{
                  exportButton: true,
                  paging: false,
                }}
        />
      </div>
    );
  }
