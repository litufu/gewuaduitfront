import React from 'react';
import MaterialTable from 'material-table';
import gql from 'graphql-tag';
import { navigate } from "@reach/router"
import { useQuery } from '@apollo/react-hooks';
import { Loading,ProjectHeader} from '../../components';
import {fmoney} from '../../utils'

const GET_AUXILIARIES = gql`
  query getAuxiliaries($projectId: String!) {
    getAuxiliaries(projectId: $projectId) 
  }
`;

export default function Auxiliary(props) {

    const columns = [
        { title: '科目编码', field: 'subject_num' },
        { title: '科目名称', field: 'subject_name' },
        { title: '核算项目类型编码', field: 'type_num' },
        { title: '核算项目类型名称',field: 'type_name'},
        { title: '核算项目编码',field: 'code'},  
        { title: '核算项目名称',field: 'name'},  
        { title: '方向',field: 'direction'},  
        { title: '期初数',field: 'initial_amount', render: rowData =>fmoney(rowData.initial_amount,2)},  
        { title: '借方发生额',field: 'debit_amount', render: rowData =>fmoney(rowData.debit_amount,2)},  
        { title: '贷方发生额',field: 'credit_amount', render: rowData =>fmoney(rowData.credit_amount,2)},  
        { title: '期末数',field: 'terminal_amount', render: rowData =>fmoney(rowData.terminal_amount,2)},  
      ]

 const { loading, error, data } = useQuery(GET_AUXILIARIES, {
    variables: { projectId:props.projectId },
  });

  if(loading) return <Loading />
  if(error) return <div>{error.message}</div>
  const newData = JSON.parse(data.getAuxiliaries)


  return (
      <div>
        <ProjectHeader
         onClick={()=>navigate(`/project/${props.projectId}`)}
         title="辅助核算明细"
        />
    <MaterialTable
      title="辅助核算明细"
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