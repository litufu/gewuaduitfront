import React from 'react';
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import gql from 'graphql-tag';
import { navigate } from "@reach/router"
import { useQuery,useMutation } from '@apollo/react-hooks';
import { Loading,ProjectHeader} from '../../components';
import GET_COMPANY from '../../graphql/get_company.query'
import {computeRelationship} from '../../compute'
import {fmoney,dateToString} from '../../utils'

const DOWNLOAD_RELARED_PARTIES_COMPANY = gql`
  mutation DownloadRelatedPatiesCompany($companyName: String!,$speed:String!) {
    downloadRelatedPatiesCompany(companyName: $companyName,speed:$speed){
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


const GET_COMPANY_DEAL = gql`
  query getCompanyDeal($projectId: String!,$num:Int!,$type:String!) {
    getCompanyDeal(projectId: $projectId,num:$num,type:$type){
      amount
      name
      company{
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
  }
`;

function SimpleDialog(props) {
  const { onClose, selectedCompany, open } = props;

  const columns = [
    { title: '名称', field: 'name' },
    { title: '类别', field: 'type' },
    { title: '关联关系', field: 'relationship' },
    { title: '级次',field: 'grade'},
  ]

  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
      <MaterialTable
        title="公司股东及高管信息"
        columns={columns}
        data={selectedCompany.relatedParties}
        options={{
          exportButton: true,
          paging: false,
        }}
    />
    </Dialog>
  );
}

export default function CheckImpotantSupplier(props) {
  const [open, setOpen] = React.useState(false);
  const [selectedCompany, setSelectedCompany] = React.useState("");
  const { loading, error, data } = useQuery(GET_COMPANY_DEAL, {
    variables: { projectId:props.projectId ,num:10,type:"supplier"},
  });
  const { loading:companyLoading, error:companyError, data:companyData } = useQuery(GET_COMPANY, {
    variables: { projectId:props.projectId },
  });

  const [
    downloadRelatedPatiesCompany,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(DOWNLOAD_RELARED_PARTIES_COMPANY,{
    update(cache, { data: { downloadRelatedPatiesCompany } }) {
      const { getCompanyDeal } = cache.readQuery({ query: GET_COMPANY_DEAL,variables:{projectId:props.projectId,num:10,type:"supplier"} });
      cache.writeQuery({
        query: GET_COMPANY_DEAL,
        variables:{projectId:props.projectId,num:10,type:"supplier"},
        data: { getCompanyDeal: getCompanyDeal.map(deal=>{
          if(deal.company.id===downloadRelatedPatiesCompany.id){
            return {amount:deal.amount,company:downloadRelatedPatiesCompany,name:deal.name}
          }else{
            return deal
          }
        }) },
      });
    }
  });

  const handleClose = value => {
    setOpen(false);
  };

  const columns = [
    { title: '名称', field: 'name',render:rowData=>(
    <Button variant="outlined" color="primary" onClick={event=>{
      setOpen(true)
      setSelectedCompany(rowData)
    }}>
      {rowData.name}
    </Button>) },
    { title: '本期采购金额', field: 'amount',render: rowData =>fmoney(rowData.amount,2) },
    { title: '地址', field: 'address' },
    { title: '法定代表人', field: 'legalRepresentative' },
    { title: '成立日期', field: 'establishDate',render:rowData=>{
        if(rowData.establishDate){
            return dateToString(new Date(rowData.establishDate)) 
        }
    }},
    { title: '注册资本', field: 'registeredCapital' },
    { title: '经营范围', field: 'businessScope' },
    { title: '关联关系', field: "relationship" ,render:rowData=>computeRelationship(companyData.company.relatedParties,rowData.relatedParties) },
  ]

  if(loading||companyLoading) return <Loading />
  if(error) return <div>{error.message}</div>
  if(companyError) return <div>{companyError.message}</div>
  
  if(mutationError) return <div>{mutationError.message}</div>

  const newData = data.getCompanyDeal.map(deal=>{
    const amount = deal.amount
    const company = deal.company
    return {amount,...company,name:deal.name}
  })

return (
    <div>
      <ProjectHeader
       onClick={()=>navigate(`/project/${props.projectId}`)}
       title="供应商分析"
      />
    <MaterialTable
          title="供应商分析"
          columns={columns}
          data={newData}
          actions={[
            {
              icon: 'save',
              tooltip: 'Save User',
              onClick: (event, rowData) => downloadRelatedPatiesCompany({variables:{companyName:rowData.name,speed:"yes"}})
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
                {mutationLoading && <Loading />}
              </Button>
            ),
          }}
          options={{
            exportButton: true,
            paging: false,
            actionsColumnIndex: -1
          }}
      />
      <SimpleDialog selectedCompany={selectedCompany} open={open} onClose={handleClose} />
      </div>
    );
}


