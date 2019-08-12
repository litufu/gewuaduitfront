import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { MySnackbar} from '../../components';
import gql from 'graphql-tag';
import {useMutation  } from '@apollo/react-hooks';
import {validatePassword} from '../../utils'

const UPDATE_PASSWORD_MUTATION = gql`
  mutation UpdatePasswordMutation($oldPassword: String!, $newPassword: String!) {
    updatePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
      id
    }
  }
`

const useStyles = makeStyles(theme => ({
  container: {
    display:"flex",
    flexWrap: 'nowrap',
    flexDirection:"column",
    alignItems:"center",
    padding: theme.spacing(3),
  },
  formControl: {
    margin: theme.spacing(1),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
}));

export default function ComposedTextField() {

    const [oldPassword, setOldPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [newPassword2, setNewPassword2] = React.useState('');
    const [message, setMessage] = React.useState("");
    const [display, setDisplay] = React.useState(false);
    const classes = useStyles();
    const [updatePassword,
        { loading: mutationLoading, error: mutationError }
    ] = useMutation(UPDATE_PASSWORD_MUTATION,{
        onCompleted() {
            setMessage("密码修改成功")
            setDisplay(true)
          }
    });
           
    return (
        <form className={classes.container} noValidate autoComplete="off">
            <TextField
                id="oldpassword"
                label="老密码"
                className={classes.textField}
                value={oldPassword}
                onChange={(event)=>setOldPassword(event.target.value)}
                margin="normal"
                type="password"
            />
            <TextField
                id="newpassword"
                label="新密码"
                className={classes.textField}
                value={newPassword}
                onChange={(event)=>setNewPassword(event.target.value)}
                margin="normal"
                type="password"
            />
            <TextField
                id="newpassword2"
                label="确认新密码"
                className={classes.textField}
                value={newPassword2}
                onChange={(event)=>setNewPassword2(event.target.value)}
                margin="normal"
                type="password"
                helperText="密码需要包含大小写字母、数字、特殊字符并且长短不小于10"
            />
            <Button 
            variant='contained' 
            fullWidth
            onClick={() => {
            if(!newPassword || !newPassword2 || !oldPassword) {
                setMessage("密码不能为空")
                setDisplay(true)
                return
            }
            if(newPassword !== newPassword2) {
                setMessage("新密码不一致")
                setDisplay(true)
                return
            }
            if(!validatePassword(newPassword)){
                setMessage("密码需要包含大小写字母、数字、特殊字符并且长短不小于10")
                setDisplay(true)
                return
            }
            updatePassword({
                variables: {
                  oldPassword,
                  newPassword
                },
              })
          }}>
            更新密码
          </Button>
          {display && <MySnackbar message={message}/>}
          {mutationLoading && <loading />}
          {mutationError && <MySnackbar message={mutationError.message}/>}
        </form>
    );
  }