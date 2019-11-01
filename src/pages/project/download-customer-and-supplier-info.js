import React,{useState} from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { Loading,ProjectHeader} from '../../components';
import { navigate } from "@reach/router"

const DOWNLOAD_CUSTOMER_AND_SUPPLIER_INFO = gql`
    mutation downloadCustomerAndSupplierInfo($projectId: String!,$num:Int!) {
        downloadCustomerAndSupplierInfo(projectId: $projectId,num:$num) 
  }
`

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 500,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  button: {
    margin: theme.spacing(1),
  },
}));


export default function CheckProject(props) {
  const classes = useStyles();
  const [num,setNum] = useState(10)
  const [
    downloadCustomerAndSupplierInfo,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(DOWNLOAD_CUSTOMER_AND_SUPPLIER_INFO,{
    onCompleted({ downloadCustomerAndSupplierInfo }) {
          if(downloadCustomerAndSupplierInfo){
              alert("正在后台下载，请稍等")
          }else{
              alert("下载失败，请联系管理员")
          }
    },
  });
  return (
    <div className={classes.root}>
        <ProjectHeader
         onClick={()=>navigate(`/project/${props.projectId}`)}
         title="下载重要客户和供应商工商信息"
        />
        <Typography>
            请在重要客户检查和重要供应商检查前下载其工商信息。
        </Typography>
      <TextField
        label="下载客户、供应商工商信息个数"
        defaultValue={num}
        className={classes.textField}
        helperText="目前默认为前10名，后续开放修改"
        margin="normal"
        onChange={event=>setNum(event.target.value)}
        disabled
      />
      <Button 
        variant="contained" 
        color="primary" 
        className={classes.button}
        onClick={()=>downloadCustomerAndSupplierInfo({variables:{projectId:props.projectId,num}})}
        >
            下载
        </Button>
        {mutationLoading && <Loading />}
         {mutationError && <div>{mutationError.message}</div>}
    </div>
  );
}