import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import { navigate } from "@reach/router"
import { useQuery } from '@apollo/react-hooks';
import { Loading,ProjectHeader} from '../../components';

const GET_HAS_TWO_SUBJECTS_COMPANIES = gql`
  query GetHasTwoSubjectsCompanies($projectId: String!) {
    getHasTwoSubjectsCompanies(projectId: $projectId) 
  }
`;

export default function HasTwoSubjectsCompanies(props) {


 const { loading, error, data } = useQuery(GET_HAS_TWO_SUBJECTS_COMPANIES, {
    variables: { projectId:props.projectId },
  });

  if(loading) return <Loading />
  if(error) return <div>{error.message}</div>
  const companies = JSON.parse(data.getHasTwoSubjectsCompanies)

  return (
      <div>
        <ProjectHeader
         onClick={()=>navigate(`/project/${props.projectId}`)}
         title="供应商或客户不同科目同时挂账"
        />
        <Typography variant="h6" gutterBottom>
            针对(应收账款/预收账)或(应付账款/预付账款)同时挂账的单位，我们应该抵消后进行披露，建议客户最好在一个科目核算
        </Typography>
        {
           (companies.receivable.length===0 &&  companies.payable.length===0 && companies.contractual.length===0)&&(
            <Typography variant="subtitle2" gutterBottom>
                本公司本会计期间未发现往来款同时挂账单位
            </Typography>
           )
        }
        {
            companies.receivable.length>0 && (
                <List component="nav" aria-label="main mailbox folders">
                    <Typography variant="subtitle2" gutterBottom>
                        应收账款和预收账同时挂账的单位
                    </Typography>
                    {
                        companies.receivable.map(name=>(
                            <ListItem 
                            key={name}
                            button>
                                <ListItemText primary={name} />
                            </ListItem>
                        ))
                    }
                </List>
            )
        }
        {
            companies.payable.length>0 && (
                <List component="nav" aria-label="main mailbox folders">
                    <Typography variant="subtitle2" gutterBottom>
                        应付账款和预付账款同时挂账的单位
                    </Typography>
                    {
                        companies.payable.map(name=>(
                            <ListItem key={name} button>
                                <ListItemText primary={name} />
                            </ListItem>
                        ))
                    }
                </List>
            )
        }
        {
            companies.contractual.length>0 && (
                <List component="nav" aria-label="main mailbox folders">
                    <Typography variant="subtitle2" gutterBottom>
                        合同资产和合同负债同时挂账的单位
                    </Typography>
                    {
                        companies.contractual.map(name=>(
                            <ListItem key={name} button>
                                <ListItemText primary={name} />
                            </ListItem>
                        ))
                    }
                </List>
            )
        }
        
     </div>
  );
}