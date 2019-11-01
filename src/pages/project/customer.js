import React from 'react';
import MaterialTable from 'material-table';
import gql from 'graphql-tag';
import Typography from '@material-ui/core/Typography';
import { navigate } from "@reach/router"
import { useQuery } from '@apollo/react-hooks';
import { Loading,ProjectHeader} from '../../components';
import {fmoney} from '../../utils'

const GET_CUSTOMER_ANALYSIS = gql`
  query GetCustomerAnalysis($projectId: String!) {
    getCustomerAnalysis(projectId: $projectId) 
  }
`;



export default function Customer(props) {

    const columns = [
        { title: '名称', field: 'name' },
        { title: '本期销售金额', field: 'sale_amount',render: rowData =>fmoney(rowData.sale_amount,2) },
        { title: '本期收款金额', field: 'receivable_amount' ,render: rowData =>fmoney(rowData.receivable_amount,2) },
        { title: '销售次数',field: 'sale_times'},
        { title: '收款次数',field: 'receivable_times'},  
        { title: '收款方式',field: 'receivable_method'},  
        { title: '月均销售额',field: 'sale_amount_per_month', render: rowData =>fmoney(rowData.sale_amount_per_month,2)},  
        { title: '月均收款额',field: 'receivable_amount_per_month', render: rowData =>fmoney(rowData.receivable_amount_per_month,2)},  
        { title: '客户月消耗额平均数',field: 'customer_consumption_per_month_average', render: rowData =>fmoney(rowData.customer_consumption_per_month_average,2)},  
        { title: '客户月消耗额方差',field: 'customer_consumption_per_month_var', render: rowData =>fmoney(rowData.customer_consumption_per_month_var,2)}, 
        { title: '收款期平均数(月)',field: 'receivable_term_average', render: rowData =>fmoney(rowData.receivable_term_average,2)},  
        { title: '收款期方差',field: 'receivable_term_var', render: rowData =>fmoney(rowData.receivable_term_var,2)},
        { title: '销售与收款差额平均数',field: 'receivable_balance_average', render: rowData =>fmoney(rowData.receivable_balance_average,2)}, 
        { title: '销售与收款差额方差',field: 'receivable_balance_var', render: rowData =>fmoney(rowData.receivable_balance_var,2)},       

      ]

 const { loading, error, data } = useQuery(GET_CUSTOMER_ANALYSIS, {
    variables: { projectId:props.projectId },
  });

  if(loading) return <Loading />
  if(error) return <div>{error.message}</div>
  const newData = JSON.parse(data.getCustomerAnalysis)


  return (
      <div>
        <ProjectHeader
         onClick={()=>navigate(`/project/${props.projectId}`)}
         title="客户分析"
        />
        <Typography>
            说明：
            1、客户月消耗额：客户本月购买金额/本月到下一次购买之间的月份
            2、收款期：本月销售与下次月份收款之间相差的月份
            3、销售与收款差额：本月销售与下次月份收款之间的差额
        </Typography>
    <MaterialTable
      title="客户分析"
      columns={columns}
      data={newData}
      options={{
        exportButton: true,
        paging: false,
      }}
    />
     </div>
  );
}