import React, { Fragment, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { navigate } from "@reach/router"
import { Header,  Loading, Company, Members } from '../components'
import GET_PROJECTS from '../graphql/get_projects.query'
import GET_MERGE_PROJECTS from '../graphql/get_merge_projects.query'
import { MadeWithLove,ProjectTable} from '../components'

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


export default function App() {
  const classes = useStyles();
  const [display, setDisplay] = useState("main")
  const [company, setCompany] = useState({})
  const [type,setType] = useState("单体")
  const [members, setMembers] = useState({})
  const { loading, error, data } = useQuery(GET_PROJECTS);
  const { loading:mergeLoading, error:mergeError, data:mergeData } = useQuery(GET_MERGE_PROJECTS);
  
  function clickCompany(company) {
    setCompany(company)
    setDisplay("company")
  }
  function clickMembers(members,type) {
    setMembers(members)
    setDisplay("members")
    setType(type)
  }
  function clickEntry(project,type) {
    if(type==="单体"){
      navigate(`/project/${project.id}`)
    }else{
      navigate(`/mergeProject/${project.id}`)
    }
    
  }
  if (loading||mergeLoading) return <Loading />;
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
  if (mergeError) return (
    <Fragment>
      <Header />
      <Container>
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            {mergeError.message}
          </Typography>
          <MadeWithLove />
        </Box>
      </Container>
    </Fragment>
  )

  console.log(data)
  console.log(mergeData)

  return (
    <Fragment>
      
      {display === "main" && (
        <Container>
          <Header />
          {
            mergeData.mergeProjects && mergeData.mergeProjects.length>0 ? (
          <ProjectTable
            projects={mergeData.mergeProjects}
            clickCompany={clickCompany}
            clickMembers={clickMembers}
            clickEntry={clickEntry}
            type="合并"
            />
            ):(
              <Typography variant="h4" component="h1" gutterBottom>
                  你还没有参加任何合并项目！
              </Typography>
            )
          }
          

{data.projects && data.projects.length>0 ?(<ProjectTable
          projects={data.projects}
          clickCompany={clickCompany}
          clickMembers={clickMembers}
          clickEntry={clickEntry}
          type="单体"
          />):(<Typography variant="h4" component="h1" gutterBottom>
          你还没有参加任何单体项目！
      </Typography>)}
          
          {/* {
            data.projects.map(project =>
              <ProjectListItem
                project={project}
                clickCompany={clickCompany}
                clickMembers={clickMembers}
                clickEntry={clickEntry}
                key={project.id} />
            )
          } */}
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
              type={type}
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