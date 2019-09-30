import React from 'react';
import {sum } from '../utils'
import MaterialTable from 'material-table';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import SelectSubject from './select-subject'
import SelectAuxiliary from './select-auxiliary'

const useStyles = makeStyles(theme => ({
    button: {
      margin: theme.spacing(1),
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
      },
    input: {
      display: 'none',
    },
  }));

function sumArray(arr,content){
    if(content==="debit"){
        const debitArr = arr.map(item=>parseFloat(item.debit))
        return sum(debitArr)
    }else if(content==="credit"){
        const creditArr = arr.map(item=>parseFloat(item.credit))
        return sum(creditArr)
    }
}

export default function Entry(props) {
  const classes = useStyles();
  const {projectId} = props
  
  const [state, setState] = React.useState({
    columns: [
      {
        title: '摘要',
        field: 'discription',
        cellStyle: {
            width:300,
        }
      },
      {
        title: '会计科目',
        field: 'subject',
        editComponent: props => (
          <SelectSubject value={props.value} onChange={props.onChange} projectId={projectId}/>
        )
      },
      {
        title: '币种',
        field: 'currency_type',
      },
      {
        title: '原币金额',
        field: 'foreign_currency',
      },
      {
        title: '借方',
        field: 'debit',
      },
      {
        title: "贷方",
        field: 'credit',
      },
      {
        title: "辅助核算",
        field: 'auxiliary',
        editComponent: props => (
          <SelectAuxiliary value={props.value} onChange={props.onChange} projectId={projectId}/>
        )
      },

    ],
    data: [
        {discription:"",subject:"",currency_type:"RMB",foreign_currency:"",debit:0.00,credit:0.00,auxiliary:""},
    ],
  });

  return (
      <div>
    <MaterialTable
      title="会计分录"
      columns={state.columns}
      data={state.data}
      options={{
        exportButton: true,
        paging: false,
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
    <div>
    <Button variant="contained" className={classes.button}>
        保存
      </Button>
    <Typography variant="h6" gutterBottom>
    {`借方合计数${sumArray(state.data,"debit")},贷方合计数${sumArray(state.data,"credit")}`}
    </Typography> 
    </div>
    </div>
  );
}