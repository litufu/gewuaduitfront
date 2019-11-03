import React from 'react';
import MaterialTable from 'material-table';
import gql from 'graphql-tag';
import { useQuery,useMutation} from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { navigate } from "@reach/router"
import { Loading,ProjectHeader} from '../../components';
import {fmoney} from '../../utils'
import {computeLetterOfProof} from '../../compute'

const ADD_LETTER_OF_PROOF = gql`
  mutation AddLetterOfProof($record:String!) {
    addLetterOfProof(record:$record) {
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
`;

const UPDATE_LETTER_OF_PROOF = gql`
  mutation UpdateLetterOfProof($record:String!) {
    updateLetterOfProof(record:$record) {
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
`;

const DELETE_LETTER_OF_PROOF = gql`
  mutation DeleteLetterOfProof($proofId:String!) {
    deleteLetterOfProof(proofId:$proofId) {
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
`;


const DOWNLOAD_LETTER_OF_PROOFS = gql`
  mutation DownloadLetterOfProofs($projectId: String!,$record:String!) {
    downloadLetterOfProofs(projectId: $projectId,record:$record) {
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
`;

const GET_ACCOUNT_AGE = gql`
  query GetAccountAge($projectId: String!) {
    getAccountAge(projectId: $projectId) 
  }
`;

const GET_LETTER_OF_PROOF_SETTING = gql`
  query GetLetterOfProofSetting($projectId: String!) {
    getLetterOfProofSetting(projectId: $projectId) 
  }
`;

const GET_LETTER_OF_PROOFS = gql`
  query GetLetterOfProofs($projectId: String!) {
    getLetterOfProofs(projectId: $projectId){
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
`;

const useStyles = makeStyles(theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      textAlign:"center",
    },
    button:{
        width: 200,
        margin: theme.spacing(1),
        paddingTop:theme.spacing(2),
    },
    paper:{
        width:500,
        alignContent:"center",
        textAlign:"center"
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

export default function LetterOfProof(props) {
  const classes = useStyles();
  const columns = [
    { title: '打印函证', field: 'print' },
    { title: '科目名称', field: 'subjectName' },
    { title: '单位名称', field: 'name' },
    { title: '单位地址', field: 'adrress' },
    { title: '联系人', field: 'contact' },
    { title: '联系人电话', field: 'telephone' },
    { title: '邮编', field: 'zipCode' },
    { title: '样本特征', field: 'sampleReason' },
    { title: '币种', field: 'currencyType' },
    { title: '发函日期', field: 'sendDate' },
    { title: '发函快递单号', field: 'sendNo' },
    { title: '回函日期', field: 'receiveDate' },
    { title: '回函快递单号', field: 'receiveNo' },
    { title: '账面余额', field: 'balance', render: rowData =>fmoney(rowData.balance,2)  },
    { title: '账面发生额', field: 'amount', render: rowData =>fmoney(rowData.amount,2)   },
    { title: '函证余额', field: 'sendBalance', render: rowData =>rowData.sendBalance ? fmoney(rowData.sendBalance,2):0.00 },
    { title: '函证发生额', field: 'sendAmount', render: rowData =>rowData.sendAmount?fmoney(rowData.sendAmount,2):0.00 },
    { title: '回函余额', field: 'receiveBalance', render: rowData =>rowData.receiveBalance?fmoney(rowData.receiveBalance,2):0.00 },
    { title: '回函发生额', field: 'receiveAmount', render: rowData =>rowData.receiveAmount?fmoney(rowData.receiveAmount,2):0.00 },
    { title: '余额差异', field: 'balanceDiff', render: rowData =>fmoney(rowData.receiveBalance-rowData.sendBalance,2) },
    { title: '发生额差异', field: 'amountDiff' , render: rowData =>fmoney(rowData.receiveAmount-rowData.sendAmount,2)},
    { title: '发函快递单照片', field: 'sendPhoto' },
    { title: '回函快递单照片', field: 'receivePhoto' },
    { title: '回函照片', field: 'proofPhoto' },
    { title: '替代程序', field: 'replace' },
  ]
 
  const { loading:accountAgeLoading, error:accountAgeError, data:accountAgeData } = useQuery(GET_ACCOUNT_AGE, {
    variables: { projectId:props.projectId},
  });
  const { loading:letterOfProofSettingLoading, error:letterOfProofSettingError, data:letterOfProofSettingData } = useQuery(GET_LETTER_OF_PROOF_SETTING, {
    variables: { projectId:props.projectId },
  });
  const { loading:letterOfProofsLoading, error:letterOfProofsError, data:letterOfProofsData } = useQuery(GET_LETTER_OF_PROOFS, {
    variables: { projectId:props.projectId },
  });
  const [
    downloadLetterOfProofs,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(DOWNLOAD_LETTER_OF_PROOFS,{
      update(cache, { data: { downloadLetterOfProofs } }) {
        cache.writeQuery({
          query: GET_LETTER_OF_PROOFS,
          variables:{projectId:props.projectId},
          data: { getLetterOfProofs:downloadLetterOfProofs },
        });
      },
    refetchQueries(){
      return([{
        query: GET_LETTER_OF_PROOFS,
        variables: { projectId: props.projectId },
      }])
    },
});

const [
  addLetterOfProof,
  { loading: addLoading, error: addError },
] = useMutation(ADD_LETTER_OF_PROOF,{
    update(cache, { data: { addLetterOfProof } }) {
      const { getLetterOfProofs } = cache.readQuery({ query: GET_LETTER_OF_PROOFS,variables:{projectId:props.projectId} });
      cache.writeQuery({
        query: GET_LETTER_OF_PROOFS,
        variables:{projectId:props.projectId},
        data: { getLetterOfProofs:[...getLetterOfProofs,addLetterOfProof] },
      });
    },
  refetchQueries(){
    return([{
      query: GET_LETTER_OF_PROOFS,
      variables: { projectId: props.projectId },
    }])
  },
});

  const [
    updateLetterOfProof,
    { loading: updateLoading, error: updateError },
  ] = useMutation(UPDATE_LETTER_OF_PROOF,{
      update(cache, { data: { updateLetterOfProof } }) {
        const { getLetterOfProofs } = cache.readQuery({ query: GET_LETTER_OF_PROOFS,variables:{projectId:props.projectId} });
        cache.writeQuery({
          query: GET_LETTER_OF_PROOFS,
          variables:{projectId:props.projectId},
          data: { getLetterOfProofs:getLetterOfProofs.map(proof=>{
            if(proof.id===updateLetterOfProof.id){
              return updateLetterOfProof
            }
            return proof
          }) },
        });
      },
    refetchQueries(){
      return([{
        query: GET_LETTER_OF_PROOFS,
        variables: { projectId: props.projectId },
      }])
    },
  });

  const [
    deleteLetterOfProof,
    { loading: deleteLoading, error: deleteError },
  ] = useMutation(DELETE_LETTER_OF_PROOF,{
      update(cache, { data: { deleteLetterOfProof } }) {
        const { getLetterOfProofs } = cache.readQuery({ query: GET_LETTER_OF_PROOFS,variables:{projectId:props.projectId} });
        cache.writeQuery({
          query: GET_LETTER_OF_PROOFS,
          variables:{projectId:props.projectId},
          data: { getLetterOfProofs:getLetterOfProofs.filter(proof=>proof.id!==deleteLetterOfProof.id) },
        });
      },
  });

  if(accountAgeLoading || letterOfProofSettingLoading||letterOfProofsLoading||
    mutationLoading||updateLoading||addLoading||deleteLoading) return <Loading />
  if(accountAgeError) return <div>{accountAgeError.message}</div>
  if(letterOfProofSettingError) return <div>{letterOfProofSettingError.message}</div>
  if(letterOfProofsError) return <div>{letterOfProofsError.message}</div>
  if(mutationError) return <div>{mutationError.message}</div>
  if(updateError) return <div>{updateError.message}</div>
  if(addError) return <div>{addError.message}</div>
  if(deleteError) return <div>{deleteError.message}</div>

  const accountAge = JSON.parse(accountAgeData.getAccountAge)
  const letterOfProofSetting  = JSON.parse(letterOfProofSettingData.getLetterOfProofSetting)
  const newAccountAgeData = computeLetterOfProof(accountAge,letterOfProofSetting)
  const sendData = newAccountAgeData.filter(item=>item.isLetter==="是").map(item=>{
    if(["应收账款","预收款项"].indexOf(item.origin_subject)!==-1){
      if(item.terminal_value>0){
          return {subjectName:"应收账款",name:item.subject_name,balance:item.terminal_value,amount:item.debit_amount,sampleReason:item.letterReason}
      }else{
        return {subjectName:"预收款项",name:item.subject_name,balance:Math.abs(item.terminal_value),amount:item.debit_amount,sampleReason:item.letterReason}
      }
    }

    if(["应付账款","预付款项"].indexOf(item.origin_subject)!==-1){
        if(item.terminal_value>0){
          return {subjectName:"预付款项",name:item.subject_name,balance:item.terminal_value,amount:item.credit_amount,sampleReason:item.letterReason}
        }else{
          return {subjectName:"应付账款",name:item.subject_name,balance:Math.abs(item.terminal_value),amount:item.credit_amount,sampleReason:item.letterReason}
        }
    }

    if(["其他应付款","其他应收款"].indexOf(item.origin_subject)!==-1){
        if(item.terminal_value>0){
          return {subjectName:"其他应收款",name:item.subject_name,balance:item.terminal_value,amount:0.00,sampleReason:item.letterReason}
        }else{
          return {subjectName:"其他应付款",name:item.subject_name,balance:Math.abs(item.terminal_value),amount:0.00,sampleReason:item.letterReason}
        }
    }
    return item
  })

  return (
      <div  className={classes.container}>
        <ProjectHeader
        onClick={()=>navigate(`/project/${props.projectId}`)}
        title="函证明细表"
        />
         <Button 
          variant="contained" 
          color="secondary" 
          className={classes.button}
          onClick={()=>downloadLetterOfProofs({variables:{projectId:props.projectId,record:JSON.stringify(sendData)}})}
          >
        获取函证列表
      </Button>

    <Table
    addLetterOfProof={addLetterOfProof}
    deleteLetterOfProof={deleteLetterOfProof}
    updateLetterOfProof={updateLetterOfProof}
    columns={columns}
    data={letterOfProofsData.getLetterOfProofs}
    />
    </div>
  );
}


function Table(props){
  const [state,setState] = React.useState({
    data:props.data
  })

  return(
    <MaterialTable
      title="函证统计表"
      columns={props.columns}
      data={state.data}
      options={{
        exportButton: true,
        paging: false,
        search:false
      }}
      editable={{
        onRowAdd: newData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              props.addLetterOfProof({variables:{record:JSON.stringify(newData)}})
              const data = [...state.data];
              data.push(newData);
              setState({ ...state, data });
            }, 600);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              props.updateLetterOfProof({variables:{record:JSON.stringify(newData)}})
              const data = [...state.data];
              data[data.indexOf(oldData)] = newData;
              setState({ ...state, data });
            }, 600);
          }),
        onRowDelete: oldData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              props.deleteLetterOfProof({variables:{proofId:oldData.id}})
              const data = [...state.data];
              data.splice(data.indexOf(oldData), 1);
              setState({ ...state, data });
            }, 600);
          }),
      }}
    />
  )
}