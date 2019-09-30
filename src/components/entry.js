import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import {sum } from '../utils'
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import SelectSubject from './select-subject'
import SelectAuxiliary from './select-auxiliary'

const ADD_ADUIT_ADJUSTMENT = gql`
  mutation AddAduitAdjustment($projectId: String!,$record:String!) {
    addAduitAdjustment(projectId: $projectId,record:$record) 
  }
`;

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
        field: 'description',
        cellStyle: {
            width:300,
        },
        initialEditValue:"",
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
        initialEditValue:"RMB",
      },
      {
        title: '原币金额',
        field: 'foreign_currency',
        initialEditValue:"0.00",
        type:"numeric"
      },
      {
        title: '借方',
        field: 'debit',
        initialEditValue:"0.00",
        type:"numeric"
      },
      {
        title: "贷方",
        field: 'credit',
        initialEditValue:"0.00",
        type:"numeric"
      },
      {
        title: "辅助核算",
        field: 'auxiliary',
        editComponent: props => (
          <SelectAuxiliary value={props.value} onChange={props.onChange} projectId={projectId}/>
        ),
        initialEditValue:"",
      },

    ],
    data: [],
  });
  const [addAduitAdjustment] = useMutation(
    ADD_ADUIT_ADJUSTMENT,
    {
      onCompleted({ addAduitAdjustment }) {
        if(addAduitAdjustment){
          alert("保存完成")
          setState({ ...state, data:[] });
        }else{
          alert("保存失败")
        }
      }
    }
    );
  
  

  return (
      <div>
    <MaterialTable
      title="会计分录"
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
    <div>
    <Button 
    variant="contained"
    className={classes.button}
    onClick={()=>{
      if((sumArray(state.data,"debit")-sumArray(state.data,"credit"))>0.00){
        alert("借贷方不相等")
        return
      }
      if(state.data.length===1){
        alert("不能只输入一行分录")
        return
      }
      addAduitAdjustment({ variables: { projectId: props.projectId,record:JSON.stringify(state.data) } });
    }}
    >
        保存
      </Button>
    </div>
    </div>
  );
}