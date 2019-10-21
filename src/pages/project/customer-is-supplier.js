import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import gql from 'graphql-tag';
import { navigate } from "@reach/router"
import { useQuery } from '@apollo/react-hooks';
import { Loading,ProjectHeader} from '../../components';
import {customerIsSupplier} from '../../compute'

const GET_SUBJECT_BALANCE = gql`
  query GetSubjectBalance($projectId: String!) {
    getSubjectBalance(projectId: $projectId) 
  }
`;

const GET_AUXILIARIES = gql`
  query getAuxiliaries($projectId: String!) {
    getAuxiliaries(projectId: $projectId) 
  }
`;


export default function CustomerIsSupplier(props) {

  const { loading:auxiliaryLoading, error:auxiliaryError, data:auxiliaryData } = useQuery(GET_AUXILIARIES, {
    variables: { projectId:props.projectId },
  });
  const { loading:subjectBalacneLoading, error:subjectBalacneError, data:subjectBalacneData } = useQuery(GET_SUBJECT_BALANCE, {
    variables: { projectId:props.projectId },
  });

  if(auxiliaryLoading||subjectBalacneLoading) return <Loading />
  if(auxiliaryError) return <div>{auxiliaryError.message}</div>
  if(subjectBalacneError) return <div>{auxiliaryError.message}</div>

  const auxiliary = JSON.parse(auxiliaryData.getAuxiliaries)
  const subjectBalance = JSON.parse(subjectBalacneData.getSubjectBalance)
  const companyNames = customerIsSupplier(auxiliary,subjectBalance)

  return (
      <div>
        <ProjectHeader
         onClick={()=>navigate(`/project/${props.projectId}`)}
         title="既是供应商又是客户的单位列表"
        />
        <List component="nav" aria-label="main mailbox folders">
            {
                companyNames.map(name=>(
                    <ListItem key={name} button>
                        <ListItemText primary={name} />
                    </ListItem>
                ))
            }
        </List>
     </div>
  );
}