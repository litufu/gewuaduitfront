import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Loading,ProjectHeader} from '../../components';
import { navigate } from "@reach/router"

const PROJECT_INIT_DATA = gql`
    mutation ProjectInitData($projectId: String!) {
        projectInitData(projectId: $projectId) 
  }
`

const useStyles = makeStyles(theme=>({
  root: {
    width: '100%',
    maxWidth: 500,
  },
  button: {
    margin: theme.spacing(1),
  },
}));



export default function CheckProject(props) {
  const classes = useStyles();
  const [
    projectInitData,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(PROJECT_INIT_DATA,{
    onCompleted({ projectInitData }) {
          if(projectInitData){
              alert("项目初始化成功")
          }else{
            alert("项目初始化失败")
          }
    },
  });

  return (
    <div className={classes.root}>
        <ProjectHeader
         onClick={()=>navigate(`/project/${props.projectId}`)}
         title="数据初始化"
        />
      <Button 
     variant="contained" 
     color="primary" 
     className={classes.button}
     onClick={()=>projectInitData({variables:{projectId:props.projectId}})}
     >
        数据初始化
      </Button>
      {mutationLoading && <Loading />}
      {mutationError && <div>{mutationError.message}</div>}
    </div>
  );
}