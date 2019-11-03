import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { navigate } from "@reach/router"
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Loading,ProjectHeader} from '../../../components';

const ADD_OR_UPDATE_LETTER_OF_PROOF_SETTING = gql`
  mutation AddOrUpdateLetterOfProofSetting($projectId: String!,$customerAmount:String!,$customeBalance:String!,$supplierAmount:String!,$supplierBalance:String!,$otherBalance:String!) {
    addOrUpdateLetterOfProofSetting(projectId: $projectId,customerAmount:$customerAmount,customeBalance:$customeBalance,supplierAmount:$supplierAmount,supplierBalance:$supplierBalance,otherBalance:$otherBalance) 
  }
`;

const useStyles = makeStyles(theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    button:{
        width: 500,
        marginTop: theme.spacing(1),
    },
    paper:{
        width:500,
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    dense: {
      marginTop: 19,
    },
    menu: {
      width: 200,
    },
  }));

  export default function LetterOfProofSetting(props) {
    const classes = useStyles();
    const [state, setState] = React.useState({
        customerAmount:"60",
        customeBalance:"60",
        supplierAmount:"60",
        supplierBalance:"60",
        otherBalance:"60",
    })
    const [
        addOrUpdateLetterOfProofSetting,
        { loading: mutationLoading, error: mutationError },
      ] = useMutation(ADD_OR_UPDATE_LETTER_OF_PROOF_SETTING,{
        onCompleted({ addOrUpdateLetterOfProofSetting }) {
              if(addOrUpdateLetterOfProofSetting){
                  alert("增加函证抽查设置成功")
              }else{
                alert("增加函证抽查设置失败")
              }
        },
      });
    
    return(
        <div>
             <ProjectHeader
    onClick={()=>navigate(`/project/${props.projectId}`)}
    title="函证抽查设置"
   />

<Paper className={classes.paper}>
     <TextField
           label="客户发生额百分比"
           className={classes.textField}
           value={state.customerAmount}
           onChange={event=>{
               setState({...state,customerAmount:event.target.value})
           }}
           margin="normal"
     />
     <TextField
           label="客户余额百分比"
           className={classes.textField}
           value={state.customeBalance}
           onChange={event=>{
               setState({...state,customeBalance:event.target.value})
           }}
           margin="normal"
     />
   <Divider />
   <TextField
           label="供应商发生额百分比"
           className={classes.textField}
           value={state.supplierAmount}
           onChange={event=>{
               setState({...state,supplierAmount:event.target.value})
           }}
           margin="normal"
     />
     <TextField
           label="供应商余额百分比"
           className={classes.textField}
           value={state.supplierBalance}
           onChange={event=>{
               setState({...state,supplierBalance:event.target.value})
           }}
           margin="normal"
     />
   <Divider />
   <TextField
           label="其他往来余额百分比"
           className={classes.textField}
           value={state.otherBalance}
           onChange={event=>{
               setState({...state,otherBalance:event.target.value})
           }}
           margin="normal"
     />
     </Paper>
     <Button 
       variant="contained" 
       color="primary" 
       className={classes.button}
       onClick={()=>addOrUpdateLetterOfProofSetting(
           {
               variables:{
                   projectId:props.projectId,
                   customerAmount:state.customerAmount,
                   customeBalance:state.customeBalance,
                   supplierAmount:state.supplierAmount,
                   supplierBalance:state.supplierBalance,
                   otherBalance:state.otherBalance,
                }
            }
        )}
       >
           设置
           {mutationLoading && <Loading />}
           {mutationError && <div>{mutationError.message}</div>}
       </Button>

        </div>
   )
  }