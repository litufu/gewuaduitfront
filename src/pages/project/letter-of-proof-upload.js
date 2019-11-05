import React from 'react';

import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import {dateToStringHan,applyTokenDo} from '../../utils'
import { Loading} from '../../components';


const ADD_PROOF_PHOTO = gql`
  mutation AddProofPhoto($id: String!, $type: String!, $name: String!) {
    addProofPhoto(id: $id, type: $type, name: $name) {
      id
      subjectName
      name
      adrress
      contact
      telephone
      zipCode
      sampleReason
      currencyType
      sendDate
      sendNo
      receiveDate
      receiveNo
      balance
      amount
      sendBalance
      sendAmount
      receiveBalance
      receiveAmount
      sendPhoto
      receivePhoto
      proofPhoto
    }
  }
`


const proofTypes = [
  {
    value: 'sendProof',
    label: '发函快递单',
  },
  {
    value: 'receiveProof',
    label: '回函快递单',
  },
  {
    value: 'proof',
    label: '回函',
  },
];




const useStyles = makeStyles((theme)=>({
  root: {
    width: '100%',
    maxWidth: 360,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  button: {
    margin: theme.spacing(1),
  },
  appBar: {
    position: 'relative',
  },
}));

export default function LetterOfProofUpload(props) {
  const classes = useStyles();
  const [proofType,setProofType] = React.useState("sendProof")
  const [file, setFile] = React.useState()
  const {proofId,companyname,accountingfirm,endtime} = props
  const [addProofPhoto, { loading, error }] = useMutation(
    ADD_PROOF_PHOTO,
    {
      onCompleted({ addProofPhoto }) {
        alert("上传完成")
      },
    }
  );

  function handleChange({
      target: {
          validity,
          files: [file]
      }
  }, type) {
      if (validity.valid) {
        setFile(file)
      }
  }

  let uploadFileClient;

  let retryCount = 0;
  const retryCountMax = 3;

  function uploadFile(client) {
    if (!uploadFileClient || Object.keys(uploadFileClient).length === 0) {
      uploadFileClient = client;
    }
    const options = {
      partSize: 500 * 1024,
      timeout: 60000
  
    };
    const spl = file.name.split(".");
    const suffix  = spl[spl.length-1]
    const key = `${proofId}_${proofType}.${suffix}`
    return uploadFileClient.multipartUpload(key, file, options).then((res) => {
      uploadFileClient = null;
      addProofPhoto({variables:{id:proofId,type:proofType,name:key}})
    }).catch((err) => {
      if (uploadFileClient && uploadFileClient.isCancel()) {
      } else {
        if (err.name.toLowerCase().indexOf('connectiontimeout') !== -1) {
          // timeout retry
          if (retryCount < retryCountMax) {
            retryCount++;
            uploadFile('');
          }
        }
      }
    });
  };

  return (
    <div className={classes.root}>
      <List className={classes.root}>
      <ListItem>
      <Typography variant="subtitle2"  gutterBottom>
        {`事务所名称：${accountingfirm}`}
      </Typography>
      </ListItem>
      <ListItem>
      <Typography variant="subtitle2" gutterBottom>
      {`公司名称：${companyname}`}
      </Typography>
      </ListItem>
      <ListItem>
      <Typography variant="subtitle2" gutterBottom>
      {`截止时间：${dateToStringHan(new Date(endtime))}`}
      </Typography>
      </ListItem>
      <ListItem>
      <TextField
        id="standard-select-currency"
        select
        label="选择上传类型"
        className={classes.textField}
        value={proofType}
        onChange={event=>setProofType(event.target.value)}
        SelectProps={{
          MenuProps: {
            className: classes.menu,
          },
        }}
        helperText=""
        margin="normal"
      >
        {proofTypes.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      </ListItem>
      <ListItem>
        <input
            type="file"
            accept="image/*"
            capture="camera"
            onChange={(event) => handleChange(event)}
        />
      </ListItem>
      <Button 
      fullWidth
      variant="contained" 
      className={classes.button}
      onClick={()=>{
        if (uploadFileClient) {
          applyTokenDo(uploadFile, false);
        } else {
          applyTokenDo(uploadFile);
        }
      }}
      >
        上传
        {loading && <Loading />}
        {error && <div>{error.message}</div>}
      </Button>
      </List>
    </div>
  );
}