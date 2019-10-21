import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Loading,ProjectHeader} from '../../components';
import { navigate } from "@reach/router"
import Button from '@material-ui/core/Button';

const COMPUTE_ACCOUNT_AGE = gql`
    mutation computeAccountAge($projectId: String!) {
        computeAccountAge(projectId: $projectId) 
  }
`
const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 500,
      },
    button: {
      margin: theme.spacing(1),
    },
  }));


export default function ComputeAccountAge(props) {
  const classes = useStyles();
  const [computeAccountAge,{loading,error}] = useMutation(COMPUTE_ACCOUNT_AGE,  {
    onCompleted({ computeAccountAge }) {
          if(computeAccountAge){
            alert("计算成功")
          }else{
            alert("计算失败")
          }
    }
  }   
);

  if(loading) return <Loading />
  if(error) return <div>{error.message}</div>


  return (
    <div className={classes.root}>
        <ProjectHeader
         onClick={()=>navigate(`/project/${props.projectId}`)}
         title="计算往来款账龄"
        />
      <Typography variant="h6" gutterBottom>
        提示：
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        1、每次导入账套后账龄计算只需一次。
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        className={classes.button}
        onClick={()=>computeAccountAge({variables:{projectId:props.projectId}})}
        >
        账龄计算
      </Button>
    </div>
  );
}