import React from 'react';
import MaterialTable from 'material-table';
import gql from 'graphql-tag';
import { navigate } from "@reach/router"
import { useQuery } from '@apollo/react-hooks';
import { Loading,ProjectHeader} from '../../components';

const GET_PROFIT_AND_LOSS_CARRY_OVER_STATUS = gql`
    query GetProfitAndLossCarryOverStatus($projectId: String!) {
        getProfitAndLossCarryOverStatus(projectId: $projectId) 
  }
`

export default function CheckProfitAndLossCarryOver(props) {
    const columns = [
        { title: '检查内容', field: 'content' },
        { title: '检查结果', field: 'result'},
      ]
    const { loading, error, data } = useQuery(GET_PROFIT_AND_LOSS_CARRY_OVER_STATUS, {
        variables: { projectId:props.projectId },
    });

    if(loading) return <Loading />
    if(error) return <div>{error.message}</div>
    console.log(data.getProfitAndLossCarryOverStatus)
    const profitAndLossCarryOverStatus = JSON.parse(data.getProfitAndLossCarryOverStatus)

    return (
        <div>
            <ProjectHeader
                onClick={()=>navigate(`/project/${props.projectId}`)}
                title="损益结转科目检查"
                />
            <MaterialTable
                title="检查损益科目结转是否存在"
                columns={columns}
                data={profitAndLossCarryOverStatus}
                options={{
                    exportButton: true,
                    paging: false,
                    search:false
                }}
                />
        </div>
    )
}