import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import gql from 'graphql-tag';
import { navigate } from "@reach/router"
import { useQuery } from '@apollo/react-hooks';
import { Loading,ProjectHeader} from '../../components';

const GET_CUSTOMER_AND_SUPPLIER_SAME_COMPANY = gql`
  query GetCustomerAndSupplierSameCompany($projectId: String!) {
    getCustomerAndSupplierSameCompany(projectId: $projectId) 
  }
`;

export default function CustomerIsSupplier(props) {


 const { loading, error, data } = useQuery(GET_CUSTOMER_AND_SUPPLIER_SAME_COMPANY, {
    variables: { projectId:props.projectId },
  });

  if(loading) return <Loading />
  if(error) return <div>{error.message}</div>
  const companyNames = JSON.parse(data.getCustomerAndSupplierSameCompany)


  return (
      <div>
        <ProjectHeader
         onClick={()=>navigate(`/project/${props.projectId}`)}
         title="既是供应商又是客户的单位列表"
        />
        <List component="nav" aria-label="main mailbox folders">
            {
                companyNames.map(name=>(
                    <ListItem button>
                        <ListItemText primary={name} />
                    </ListItem>
                ))
            }
        </List>
     </div>
  );
}