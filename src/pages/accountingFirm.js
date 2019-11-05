import React,{Fragment} from 'react';
import gql from 'graphql-tag';
import {useQuery,useMutation } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { Loading,Header} from '../components';
import Button from '@material-ui/core/Button';

export const GET_ACCOUNTINGFIRM = gql`
  query accountingFirm {
    accountingFirm{
      id
      name
      email
      code
      address
      phone
      zipCode
      fax
      returnAddress
      returnPhone
      returnPerson
    }
  }
`;

const UPDATE_ACCOUNTINGFIRM = gql`
  mutation UpdateAccountingFirm($record:String!) {
    updateAccountingFirm(record:$record) {
        id
        name
        email
        code
        address
        phone
        zipCode
        fax
        returnAddress
        returnPhone
        returnPerson
    }
  }
`;


const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection:"column"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  dense: {
    marginTop: theme.spacing(2),
  },
  menu: {
    width: 200,
  },
  submit: {
    width: 200,
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function AccountingFirm() {
  const classes = useStyles();
  const [edit,setEdit] = React.useState(false)
  const [values,setValues] = React.useState({
    zipCode:"",
    fax:"",
    returnAddress:"",
    returnPhone:"",
    returnPerson:"",
  })
  const { loading, error, data } = useQuery(GET_ACCOUNTINGFIRM,{
    fetchPolicy:"network-only"
  });
  const [
    updateAccountingFirm,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(UPDATE_ACCOUNTINGFIRM,{
    update(cache, { data: { updateAccountingFirm } }) {
        cache.writeQuery({
          query: GET_ACCOUNTINGFIRM,
          data: { accountingFirm: updateAccountingFirm },
        });
      }
  });
  if(loading||mutationLoading) return <Loading />
  if(error) return <div>{error.message}</div>
  if(mutationError) return <div>{mutationError.message}</div>

  return (
      <Fragment>
          <Header />
          <Typography variant="h6"  gutterBottom>
        会计师事务所信息
      </Typography>
    <form className={classes.container} noValidate autoComplete="off">
      <TextField
        disabled
        fullWidth
        label="名称"
        defaultValue={data.accountingFirm.name}
        className={classes.textField}
        margin="normal"
        variant="outlined"
      />
    <TextField
        disabled
        label="地址"
        defaultValue={data.accountingFirm.address}
        className={classes.textField}
        margin="normal"
        variant="outlined"
      />
    <TextField
        disabled
        label="电话"
        defaultValue={data.accountingFirm.phone}
        className={classes.textField}
        margin="normal"
        variant="outlined"
      />
      <TextField
        disabled={!edit}
        label="邮编"
        className={classes.textField}
        value={values.zipCode?values.zipCode:data.accountingFirm.zipCode}
        onChange={(event)=>setValues({...values,zipCode:event.target.value})}
        margin="normal"
        variant="outlined"
      />
      <TextField
        disabled={!edit}
        label="传真"
        className={classes.textField}
        value={values.fax?values.fax:data.accountingFirm.fax}
        onChange={(event)=>setValues({...values,fax:event.target.value})}
        margin="normal"
        variant="outlined"
      />
      <TextField
        disabled={!edit}
        label="回函地址"
        className={classes.textField}
        value={values.returnAddress?values.returnAddress:data.accountingFirm.returnAddress}
        onChange={(event)=>setValues({...values,returnAddress:event.target.value})}
        margin="normal"
        variant="outlined"
      />
      <TextField
        disabled={!edit}
        label="回函电话"
        className={classes.textField}
        value={values.returnPhone?values.returnPhone:data.accountingFirm.returnPhone}
        onChange={(event)=>setValues({...values,returnPhone:event.target.value})}
        margin="normal"
        variant="outlined"
      />
      <TextField
        disabled={!edit}
        label="回函联系人"
        className={classes.textField}
        value={values.returnPerson?values.returnPerson:data.accountingFirm.returnPerson}
        onChange={(event)=>setValues({...values,returnPerson:event.target.value})}
        margin="normal"
        variant="outlined"
      />
        <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={()=>{
                if(edit){
                    updateAccountingFirm({variables:{record:JSON.stringify({id:data.accountingFirm.id,...values})}})
                }
                setEdit(!edit)
                
            }}
          >
            {edit? "保存":"编辑"}
          </Button>
    </form>
    </Fragment>
  );
}