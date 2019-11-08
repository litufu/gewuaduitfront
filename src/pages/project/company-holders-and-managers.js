import React from 'react';
import MaterialTable from 'material-table';
import gql from 'graphql-tag';
import { navigate } from "@reach/router"
import { useQuery,useMutation } from '@apollo/react-hooks';
import Button from '@material-ui/core/Button';
import GET_COMPANY from '../../graphql/get_company.query'
import { Loading,ProjectHeader} from '../../components';
import { makeStyles } from '@material-ui/core/styles';

const DOWNLOAD_RELATEDPARTIES = gql`
  mutation DownloadRelatedPaties($companyName: String!,$speed:String!) {
    downloadRelatedPaties(companyName: $companyName,speed:$speed){
        id
        name
        code
        address
        legalRepresentative
        establishDate
        registeredCapital
        businessScope
        holders{
            id
            name
            ratio
        }
        relatedParties{
            id
            grade
            relationship
            type
            name
        }
    } 
  }
`;

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
      },
      button: {
        margin: theme.spacing(1),
      },
}))

export default function HoldersAndMangers(props) {
    const classes = useStyles();
    const { loading:companyLoading, error:companyError, data } = useQuery(GET_COMPANY, {
        variables: { projectId:props.projectId },
      });

    const [
        downloadRelatedPaties,
    { loading: mutationLoading, error: mutationError },
    ] = useMutation(DOWNLOAD_RELATEDPARTIES,{
        update(cache, { data: { downloadRelatedPaties } }) {
          const { company } = cache.readQuery({ query: GET_COMPANY,variables:{projectId:props.projectId} });
          cache.writeQuery({
            query: GET_COMPANY,
            variables:{projectId:props.projectId},
            data: { company: {...company,relatedParties:downloadRelatedPaties} },
          });
        }
      });
   
    

    const columns = [
        { title: '名称', field: 'name' },
        { title: '类别', field: 'type' },
        { title: '关联关系', field: 'relationship' },
        { title: '级次',field: 'grade'},
      ]


  if(companyLoading) return <Loading />
  if(companyError) return <div>{companyError.message}</div>

  return (
      <div>
        <ProjectHeader
         onClick={()=>navigate(`/project/${props.projectId}`)}
         title="公司股东及高管信息"
        />
        <Button 
      color="primary" 
      variant="contained"
      className={classes.button}
      onClick={()=>downloadRelatedPaties({variables:{companyName:data.company.name,speed:"no"}})}
      >
            获取公司股东及高管信息
        </Button>
        {mutationLoading && <Loading />}
        {mutationError && <div>{mutationError.message}</div>}
    <MaterialTable
      title="公司股东及高管信息"
      columns={columns}
      data={data.company.relatedParties}
      options={{
        exportButton: true,
        paging: false,
      }}
    />
     </div>
  );
}