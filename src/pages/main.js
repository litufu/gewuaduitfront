import React, { Fragment, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Fab from '@material-ui/core/Fab';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { Header, ProjectListItem, Loading, Company, Members } from '../components'
import Project from './project'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
    position: 'relative',
    minHeight: 200,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const GET_PROJECTS = gql`
    query Projects{
        projects{
          id
          startTime
          endTime
          members{
            id
            role
            user{
              id
              email
              name
            }
          }
          company{
            id
            name
            code
            address
            legalRepresentative
            establishDate
            registeredCapital
            paidinCapital
            businessScope
            holders{
              id
              name
              ratio
            }
          }
        }
    }
`

function MadeWithLove() {


  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Built with love by the '}
      <Link color="inherit" href="https://material-ui.com/">
        Material-UI
      </Link>
      {' team.'}
    </Typography>
  );
}

export default function App() {
  const classes = useStyles();
  const theme = useTheme();
  const [display, setDisplay] = useState("main")
  const [company, setCompany] = useState({})
  const [members, setMembers] = useState({})
  const [project, setProject] = useState({})
  const { loading, error, data } = useQuery(GET_PROJECTS);

  function clickCompany(company) {
    setCompany(company)
    setDisplay("company")
  }
  function clickMembers(members) {
    setMembers(members)
    setDisplay("members")
  }
  function clickEntry(project) {
    setProject(project)
    setDisplay("project")
  }
  if (loading) return <Loading />;
  if (error) return (
    <Fragment>
      <Header />
      <Container>
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            {error.message}
          </Typography>
          <MadeWithLove />
        </Box>
      </Container>
    </Fragment>
  )
  if (data.projects.length === 0) {
    return (
      <Fragment>
        <Header />
        <Container>
          <Box my={4}>
            <Typography variant="h4" component="h1" gutterBottom>
              你还没有参加任何项目！
          </Typography>
            <MadeWithLove />
          </Box>
        </Container>
      </Fragment>
    )
  }

  return (
    <Fragment>
      
      {display === "main" && (
        <Container>
          <Header />
          {
            data.projects.map(project =>
              <ProjectListItem
                project={project}
                clickCompany={clickCompany}
                clickMembers={clickMembers}
                clickEntry={clickEntry}
                key={project.id} />
            )
          }
          <MadeWithLove />
        </Container>
      )}
      {
        display === "company" && (
          <Container>
            <Header />
            <Company
              company={company}
            />
            <Fab
              variant="contained"
              className={classes.fab}
              color="primary"
              onClick={() => setDisplay("main")}
            >
              返回主页
            </Fab>
          </Container>
        )
      }
      {
        display === "members" && (
          <Container>
            <Header />
            <Members
              members={members}
            />
            <Button
              variant="contained"
              className={classes.fab}
              color="primary"
              onClick={() => setDisplay("main")}
            >
              返回主页
            </Button>
          </Container>
        )
      }
      {
        display === "project" && (
          <Container>

            <Project
              project={project}
            />
            <Button
              variant="contained"
              className={classes.fab}
              color="primary"
              onClick={() => setDisplay("main")}
            >
              返回主页
            </Button>
          </Container>

        )
      }

    </Fragment>
  );
}