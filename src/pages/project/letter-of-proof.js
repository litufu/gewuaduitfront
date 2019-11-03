import React from 'react';
import MaterialTable from 'material-table';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';


const useStyles = makeStyles(theme => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      textAlign:"center",
    //   alignContent:"center",
    //   flexDirection:"row"
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

export default function MaterialTableDemo() {
  const classes = useStyles();
  const [state, setState] = React.useState({
      customer:{
        firstAmountRatio:60,
        firstBalanceRatio:60,
      },
      supplier:{
        firstAmountRatio:60,
        firstBalanceRatio:60,
      },
      other:{
        firstBalanceRatio:60,
      },
    
    columns: [
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
      { title: '账面余额', field: 'balance' },
      { title: '账面发生额', field: 'amount' },
      { title: '函证余额', field: 'sendBalance' },
      { title: '函证发生额', field: 'sendAmount' },
      { title: '回函余额', field: 'receiveBalance' },
      { title: '回函发生额', field: 'receiveAmount' },
      { title: '余额差异', field: 'balanceDiff' },
      { title: '发生额差异', field: 'amountDiff' },
      { title: '发函快递单照片', field: 'sendPhoto' },
      { title: '回函快递单照片', field: 'receivePhoto' },
      { title: '回函照片', field: 'proofPhoto' },
      { title: '替代程序', field: 'replace' },
    ],
    data: [
      { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
      {
        name: 'Zerya Betül',
        surname: 'Baran',
        birthYear: 2017,
        birthCity: 34,
      },
    ],
  });

  return (
      <div  className={classes.container}>
 


      
    <MaterialTable
      title="函证统计表"
      columns={state.columns}
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
              const data = [...state.data];
              data.push(newData);
              setState({ ...state, data });
            }, 600);
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              const data = [...state.data];
              data[data.indexOf(oldData)] = newData;
              setState({ ...state, data });
            }, 600);
          }),
        onRowDelete: oldData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve();
              const data = [...state.data];
              data.splice(data.indexOf(oldData), 1);
              setState({ ...state, data });
            }, 600);
          }),
      }}
    />
    </div>
  );
}