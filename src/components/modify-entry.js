import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import {sum } from '../utils'
import MaterialTable from 'material-table';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import SelectSubject from './select-subject'
import SelectAuxiliary from './select-auxiliary'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

const GET_TB = gql`
  query GetTB($projectId: String!,$type:String!) {
    getTB(projectId: $projectId,type:$type) 
  }
`;

const GET_ADUIT_ADJUSTMENTS = gql`
  query GetAduitAdjustments($projectId: String!) {
    getAduitAdjustments(projectId: $projectId) 
  }
`;

const MODIFY_ADUIT_ADJUSTMENT = gql`
  mutation ModifyAduitAdjustment($projectId: String!,$record:String!,$vocherNum:Int!) {
    modifyAduitAdjustment(projectId: $projectId,record:$record,vocherNum:$vocherNum) 
  }
`;

const useStyles = makeStyles(theme => ({
    root: {
      margin: theme.spacing(1),
    },
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
    formControl: {
        margin: theme.spacing(2),
        minWidth: 150,
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

export default function ModifyEntry(props) {
  const classes = useStyles();
  const {projectId,vocherNums} = props
  const [vocherNum,setVocherNum] = React.useState(0)
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
  const [modifyAduitAdjustment] = useMutation(
    MODIFY_ADUIT_ADJUSTMENT,
    {
      onCompleted({ modifyAduitAdjustment }) {
        if(modifyAduitAdjustment){
          alert("修改完成")
          setState({ ...state, data:[] });
        }else{
          alert("修改失败")
        }
      },
      refetchQueries(){
        return([
          {
            query: GET_ADUIT_ADJUSTMENTS,
            variables: { projectId: projectId },
          },
          {
            query: GET_TB,
            variables: { projectId: props.projectId,type:"adjustment" },
            },
            {
              query: GET_TB,
              variables: { projectId: props.projectId,type:"audited" },
            }
      ])
      },
    }
    );

  return (
      <div className={classes.root}>
    <FormControl className={classes.formControl}>
        <InputLabel htmlFor="age-simple">选择修改的凭证号</InputLabel>
        <Select
          value={vocherNum}
          onChange={(event)=>setVocherNum(event.target.value)}
        >
          {
            vocherNums.map(vocherNum=>(
              <MenuItem value={vocherNum} key={vocherNum}>{vocherNum}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
      <Typography variant="h6" gutterBottom>
        输入新的调整分录
      </Typography>
    <MaterialTable
      title="会计分录"
      columns={state.columns}
      data={state.data}
      options={{
        paging: false,
        search: false
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
      if(vocherNum===0){
        alert("没有选择凭证号")
        return
      }
      modifyAduitAdjustment({ variables: { projectId: props.projectId,record:JSON.stringify(state.data),vocherNum } });
    }}
    >
        保存
      </Button>
    </div>
    </div>
  );
}