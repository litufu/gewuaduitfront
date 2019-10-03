import React from 'react';
import MaterialTable from 'material-table';
import gql from 'graphql-tag';
import { navigate } from "@reach/router"
import { useQuery,useMutation } from '@apollo/react-hooks';
import { Loading,ProjectHeader,ModifyAduitAdjustment} from '../../components';
import {fmoney} from '../../utils'

const GET_IMPORTANCE = gql`
  query GetImportance($projectId: String!) {
    getImportance(projectId: $projectId) 
  }
`;

export default function Importance(props) {

  const { loading, error, data } = useQuery(GET_IMPORTANCE, {
        variables: { projectId:props.projectId },
        fetchPolicy:"network-only"
  });
  if(loading) return <Loading />
  if(error) return <div>{error.message}</div>
  const importance = JSON.parse(data.getImportance)
  const metrologicalBasis = importance["metrologicalBasis"]
  const metrologicalBasisValue = importance["metrologicalBasisValue"]
  const metrologicalBasisValueDisplay = fmoney(metrologicalBasisValue,2)
  const overallReportFormLevelRatio = importance["overallReportFormLevelRatio"]
  const overallReportFormLevelValue = parseInt(metrologicalBasisValue*overallReportFormLevelRatio)
  const actualImportanceLevelRatio = importance["actualImportanceLevelRatio"]
  const actualImportanceLevelValue = parseInt(overallReportFormLevelValue*actualImportanceLevelRatio)
  const uncorrectedMisstatement = importance["uncorrectedMisstatement"]
  const uncorrectedMisstatementValue = parseInt(overallReportFormLevelValue*uncorrectedMisstatement)

  const newData = [
    { name: '公司类型', value: importance["companyNature"]},  
    // { name: '事务所最低财务报表整体重要性水平', value: '50000'},  
    { name: '重要性水平计量基础', value: metrologicalBasis},
    { name: '计量基础金额', value: metrologicalBasisValueDisplay},
    { name: '财务报表整体重要性适用比率', value: overallReportFormLevelRatio},
    { name: '财务报表整体重要性金额', value: overallReportFormLevelValue},
    { name: '实际执行的重要性适用比率', value: actualImportanceLevelRatio},
    { name: '实际执行的重要性金额', value: actualImportanceLevelValue},
    { name: '未更正错报水平适用比率', value: uncorrectedMisstatement},
    { name: '未更正错报水平金额', value: uncorrectedMisstatementValue},
  ]

  const columns = [
    { title: '项目', field: 'name' },
    { title: '项目值', field: 'value' },
  ]


  return (
      <div>
           <ProjectHeader
        onClick={()=>navigate(`/project/${props.projectId}`)}
        title="重要性水平"
        />
    <MaterialTable
      title="重要性水平计算表"
      columns={columns}
      data={newData}
      options={{
        exportButton: true,
        paging: false,
        search:false
      }}
    />
    </div>
  );
}