import React from 'react';
import MaterialTable from 'material-table';
import gql from 'graphql-tag';
import Typography from '@material-ui/core/Typography';
import { navigate } from "@reach/router"
import { useQuery } from '@apollo/react-hooks';
import { Loading,ProjectHeader} from '../../components';
import {fmoney} from '../../utils'

const GET_SUPPLIER_ANALYSIS = gql`
  query GetSupplierAnalysis($projectId: String!) {
    getSupplierAnalysis(projectId: $projectId) 
  }
`;

export default function Auxiliary(props) {

    const columns = [
        { title: '名称', field: 'name' },
        { title: '本期购买金额', field: 'purchase_amount',render: rowData =>fmoney(rowData.purchase_amount,2) },
        { title: '本期付款金额', field: 'payment_amount' ,render: rowData =>fmoney(rowData.payment_amount,2) },
        { title: '购买次数',field: 'purchase_times'},
        { title: '付款次数',field: 'payment_times'},  
        { title: '付款方式',field: 'purchase_method'},  
        { title: '月均购买额',field: 'purchase_amount_per_month', render: rowData =>fmoney(rowData.purchase_amount_per_month,2)},  
        { title: '月均付款额',field: 'payment_amount_per_month', render: rowData =>fmoney(rowData.payment_amount_per_month,2)},  
        { title: '月消耗额平均数',field: 'consumption_per_month_average', render: rowData =>fmoney(rowData.consumption_per_month_average,2)},  
        { title: '月消耗额方差',field: 'consumption_per_month_var', render: rowData =>fmoney(rowData.consumption_per_month_var,2)},  
        { title: '平均付款期(月)',field: 'payment_term_average', render: rowData =>fmoney(rowData.payment_term_average,2)}, 
        { title: '付款期方差',field: 'payment_term_var', render: rowData =>fmoney(rowData.payment_term_var,2)},  
        { title: '购买与付款差额平均值',field: 'payment_balance_average', render: rowData =>fmoney(rowData.payment_balance_average,2)},
        { title: '购买与付款差额方差',field: 'payment_balance_var', render: rowData =>fmoney(rowData.payment_balance_var,2)},    

      ]

 const { loading, error, data } = useQuery(GET_SUPPLIER_ANALYSIS, {
    variables: { projectId:props.projectId },
  });

  if(loading) return <Loading />
  if(error) return <div>{error.message}</div>
  const newData = JSON.parse(data.getSupplierAnalysis)


  return (
      <div>
        <ProjectHeader
         onClick={()=>navigate(`/project/${props.projectId}`)}
         title="供应商分析"
        />
         <Typography>
            说明：
            1、月消耗额：本月购买金额/本月到下一次购买之间的月份
            2、付款期：本月采购与下次月份付款之间相差的月份
            3、采购与付款差额：本月采购与下次月份付款之间的差额
        </Typography>
    <MaterialTable
      title="供应商分析"
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