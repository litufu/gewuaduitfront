import React from 'react';
import MaterialTable from 'material-table';
import { navigate } from "@reach/router"
import { useQuery } from '@apollo/react-hooks';
import { Loading,ProjectHeader} from '../../components';
import GET_MERGE_PROJECTS from '../../graphql/get_merge_projects.query'


// 未来此处增加增删子公司功能
export default function MergeCompanyNature(props) {

    const columns = [
        { title: '名称', field: 'name' },
        { title: '性质', field: 'type'},
      ]
      const { loading, error, data } = useQuery(GET_MERGE_PROJECTS);


    if(loading) return <Loading />
    if(error) return <div>{error.message}</div>
    const project = data.mergeProjects.filter(project=>project.id===props.mergeProjectId)[0]
    let newSonCompanies = []
    if(project &&  project.sonCompanies){
        newSonCompanies = project.sonCompanies.map(item=>({
            type:item.type,
            name:item.company.name
        }))
    }
    
  return (
      <div>
        <ProjectHeader
         onClick={()=>navigate(`/mergeProject/${props.mergeProjectId}`)}
         title="合并范围内子公司性质"
        />
     
    <MaterialTable
      title="子公司性质"
      columns={columns}
      data={newSonCompanies}
      options={{
        exportButton: true,
        paging: false,
      }}
    />
     </div>
  );
}