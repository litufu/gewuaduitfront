import React from 'react';
import MaterialTable from 'material-table';
import gql from 'graphql-tag';
import { navigate } from "@reach/router"
import { useQuery} from '@apollo/react-hooks';
import { Loading,ProjectHeader} from '../../components';
import {fmoney} from '../../utils'
import {companyNature} from '../../constant'
import {getImportance,getProjectById} from '../../compute'
import GET_PROJECTS from '../../graphql/get_projects.query'

const GET_TB = gql`
  query GetTB($projectId: String!,$type:String!) {
    getTB(projectId: $projectId,type:$type) 
  }
`;

export default function Importance(props) {

  const { loading, error, data } = useQuery(GET_PROJECTS);
  const { loading:auditedLoading, error:auditedError, data:auditedData } = useQuery(GET_TB, {
    variables: { projectId:props.projectId ,type:"audited"},
  });

  if(loading||auditedLoading) return <Loading />
  if(error) return <div>{error.message}</div>
  if(auditedError) return <div>{auditedError.message}</div>

  const tbData = JSON.parse(auditedData.getTB)
  const tb = tbData.filter(data=>Math.abs(data.amount)>0.00)
  const project = getProjectById(props.projectId,data.projects)
  const nature = project.company.nature
  const company_nature  = companyNature[nature]
  const importance = getImportance(company_nature,tb)

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