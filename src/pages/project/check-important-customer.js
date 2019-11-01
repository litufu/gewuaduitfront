import React from 'react';
import _ from 'lodash'
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import gql from 'graphql-tag';
import { navigate } from "@reach/router"
import { useQuery } from '@apollo/react-hooks';
import { Loading,ProjectHeader} from '../../components';
import GET_COMPANIES from '../../graphql/get_companies.query'
import GET_COMPANY from '../../graphql/get_company.query'
import {fmoney,dateToString} from '../../utils'

const GET_CUSTOMER_ANALYSIS = gql`
  query GetCustomerAnalysis($projectId: String!) {
    getCustomerAnalysis(projectId: $projectId) 
  }
`;

export default function CheckImpotantCustomer(props) {

    const { loading, error, data } = useQuery(GET_CUSTOMER_ANALYSIS, {
      variables: { projectId:props.projectId },
    });

    const { loading:companyLoading, error:companyError, data:companyData } = useQuery(GET_COMPANY, {
      variables: { projectId:props.projectId },
    });

    if(loading||companyLoading) return <Loading />
    if(error) return <div>{error.message}</div>
    if(companyError) return <div>{companyError.message}</div>

    const newData = JSON.parse(data.getCustomerAnalysis)
    let customers  
    customers = _.orderBy(newData,["sale_amount"],["desc"])
    customers = customers.slice(0,10)
    customers = customers.map(customer=>({name:customer.name,sale_amount:customer.sale_amount}))
  
  return (
      <div>
        <ProjectHeader
         onClick={()=>navigate(`/project/${props.projectId}`)}
         title="客户分析"
        />

        <CustomerInfoTable
        customers={customers}
        company = {companyData.company}
        />
        
     </div>
  );
}

function CustomerInfoTable(props){
    const columns = [
        { title: '名称', field: 'name' },
        { title: '本期销售金额', field: 'sale_amount',render: rowData =>fmoney(rowData.sale_amount,2) },
        { title: '地址', field: 'address' },
        { title: '法定代表人', field: 'legalRepresentative' },
        { title: '成立日期', field: 'establishDate',render:rowData=>{
            if(rowData.establishDate){
                return dateToString(new Date(rowData.establishDate)) 
            }
        }},
        { title: '注册资本', field: 'registeredCapital' },
        { title: '经营范围', field: 'businessScope' },
        { title: '关联关系', field: 'name' },
    ]
    const { loading, error, data } = useQuery(GET_COMPANIES, {
        variables: { companyNames:props.customers.map(customer=>customer.name) },
      });
    
      if(loading) return <Loading />
      if(error) return <div>{error.message}</div>
      const customers = props.customers
      const newCustomers = customers.map(customer=>{
          const companies = data.getCompanies.filter(company=>company.name===customer.name)
          if(companies.length>0){
              return {...customer,...companies[0]}
          }else{
              return customer
          }
      })

      return (
        <MaterialTable
                title="客户分析"
                columns={columns}
                data={newCustomers}
                actions={[
                  {
                    icon: 'save',
                    tooltip: 'Save User',
                    onClick: (event, rowData) => alert("You saved " + rowData.name)
                  }
                ]}
                components={{
                  Action: props => (
                    <Button
                      onClick={(event) => props.action.onClick(event, props.data)}
                      color="primary"
                      variant="contained"
                      style={{textTransform: 'none'}}
                      size="small"
                    >
                      关联方检查
                    </Button>
                  ),
                }}
                options={{
                  exportButton: true,
                  paging: false,
                  actionsColumnIndex: -1
                }}
            />
      )
      

    
}


// <Typography>
// 说明：
// 1、客户月消耗额：客户本月购买金额/本月到下一次购买之间的月份
// 2、收款期：本月销售与下次月份收款之间相差的月份
// 3、销售与收款差额：本月销售与下次月份收款之间的差额
// </Typography>
