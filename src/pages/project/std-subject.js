import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { navigate } from "@reach/router"
import { Loading,ProjectHeader} from '../../components';

const GET_STDSUBJECTS = gql`
  query StdSubjects {
    stdSubjects{
        id
        code
        name
    }
  }
`;

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));


export default function StdSubject(props) {
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_STDSUBJECTS);

  if(loading) return <Loading />
  if(error) return <div>{error.message}</div>

  return (
    <div className={classes.root}>
        <ProjectHeader
         onClick={()=>navigate(`/project/${props.projectId}`)}
         title="标准科目设置"
        />
      <List component="nav" aria-label="main mailbox folders">
          {
              data.stdSubjects.map(stdSubject=>(
              <ListItem key={stdSubject.id}>
                <ListItemText primary={`${stdSubject.code}  ${stdSubject.name}`} />
            </ListItem>))
          }
      </List>
    </div>
  );
}