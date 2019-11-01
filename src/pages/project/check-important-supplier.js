import React from 'react';
import _ from 'lodash'
import MaterialTable from 'material-table';
import gql from 'graphql-tag';
import { navigate } from "@reach/router"
import { useQuery } from '@apollo/react-hooks';
import { Loading,ProjectHeader} from '../../components';
import GET_COMPANIES from '../../graphql/get_companies.query'
import {fmoney,dateToString} from '../../utils'

const GET_SUPPLIER_ANALYSIS = gql`
  query GetSupplierAnalysis($projectId: String!) {
    getSupplierAnalysis(projectId: $projectId) 
  }
`;

export default function CheckImpotantSupplier(props) {

    const { loading, error, data } = useQuery(GET_SUPPLIER_ANALYSIS, {
    variables: { projectId:props.projectId },
    });

    if(loading) return <Loading />
    if(error) return <div>{error.message}</div>
    const newData = JSON.parse(data.getSupplierAnalysis)
    let companies  
    companies = _.orderBy(newData,["purchase_amount"],["desc"])
    companies = companies.slice(0,10)
    companies = companies.map(company=>({name:company.name,purchase_amount:company.purchase_amount}))
  
  return (
      <div>
        <ProjectHeader
         onClick={()=>navigate(`/project/${props.projectId}`)}
         title="供应商分析"
        />

        <InfoTable
        companies={companies}
        />
        
     </div>
  );
}

function InfoTable(props){
    const columns = [
        { title: '名称', field: 'name' },
        { title: '本期销售金额', field: 'purchase_amount',render: rowData =>fmoney(rowData.purchase_amount,2) },
        { title: '地址', field: 'address' },
        { title: '法定代表人', field: 'legalRepresentative' },
        { title: '成立日期', field: 'establishDate',render:rowData=>{
            if(rowData.establishDate){
                return dateToString(new Date(rowData.establishDate)) 
            }
        }},
        { title: '注册资本', field: 'registeredCapital' },
        { title: '经营范围', field: 'businessScope' },
        { title: '是否关联方', field: 'name' },
    ]
    const { loading, error, data } = useQuery(GET_COMPANIES, {
        variables: { companyNames:props.companies.map(company=>company.name) },
      });
    
      if(loading) return <Loading />
      if(error) return <div>{error.message}</div>
      const companies = props.companies
      const newCompanies = companies.map(company=>{
          const companyInfos = data.getCompanies.filter(companyInfo=>companyInfo.name===company.name)
          if(companies.length>0){
              return {...company,...companyInfos[0]}
          }else{
              return company
          }
      })

      return (
        <MaterialTable
                title="供应商分析"
                columns={columns}
                data={newCompanies}
                options={{
                exportButton: true,
                paging: false,
                }}
            />
      )
      

    
}
