import React from 'react';
import gql from 'graphql-tag';
import { useQuery,useMutation } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import MaterialTable from 'material-table';
import { navigate } from "@reach/router"
import { Loading,ProjectHeader,MySnackbar} from '../../components';
import {getCompareTb} from '../../compute'
import {fmoney} from '../../utils'

const GET_TB = gql`
  query GetTB($projectId: String!,$type:String!) {
    getTB(projectId: $projectId,type:$type) 
  }
`;

const GET_PREVIOUS_TB = gql`
query GetPreviousTb($projectId: String!,$statement:String!) {
  getPreviousTb(projectId: $projectId,statement:$statement) 
}
`;

const ADD_CHANGE_REASON = gql`
  mutation AddChangeReason($projectId: String!,$record:String!) {
    addChangeReason(projectId: $projectId,record:$record) 
  }
`;

const GET_CHANGE_REASON = gql`
query GetChangeReasons($projectId: String!,$statement:String!,$audit:String!) {
  getChangeReasons(projectId: $projectId,statement:$statement,audit:$audit) 
}
`;

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  button: {
    margin: theme.spacing(1),
  },
}));

function Table(props){
  const {statement,audit,newData,columns,addChangeReason,projectId} = props
  const [state, setState] = React.useState({
    data:newData
  })

  return(
    <MaterialTable
            title={`${statement}(${audit})`}
            columns={columns}
            data={state.data}
            options={{
                exportButton: true,
                paging: false,
              }}
              editable={{
                onRowUpdate: (newData, oldData) =>
                new Promise(resolve => {
                  setTimeout(() => {
                    resolve();
                    if(newData.reason){
                      const record = {statement,audit,order:newData.order,reason:newData.reason}
                      addChangeReason({variables:{projectId,record:JSON.stringify(record)}})
                    }
                    const data = [...state.data];
                    data[data.indexOf(oldData)] = newData;
                    setState({ ...state, data });
                  }, 600);
                }),
              }}
      />
  )
}

export default function ReportAnalysis(props) {
  const classes = useStyles();
  const {statement,audit,projectId} = props
  const [
    addChangeReason,
  ] = useMutation(ADD_CHANGE_REASON,{
    onCompleted({ addChangeReason }) {
          if(addChangeReason){
              alert("增加变动原因成功")
          }else{
            alert("增加变动原因失败")
          }
    },
    refetchQueries(){
      return([
        {
          query: GET_CHANGE_REASON,
          variables: { projectId: props.projectId,statement,audit },
        },
    ])
    },
  });
  const { loading:changeReasonLoading, error:changeReasonError, data:changeReasonData } = useQuery(GET_CHANGE_REASON, {
    variables: { projectId ,statement,audit},
  });

  const { loading:previousLoading, error:previousError, data:previousData } = useQuery(GET_PREVIOUS_TB, {
    variables: { projectId ,statement},
  });
  const type = audit==="未审" ? "unAudited":"audited"
  const { loading, error, data } = useQuery(GET_TB, {
    variables: { projectId ,type},
    fetchPolicy:type==="unAudited"?"cache-and-network":"network-only"
  });
  
  if(previousLoading||loading||changeReasonLoading) return <Loading />
  if(previousError) return <div>{`上期数加载错误，${previousError.message}`}</div>
  if(error) return <div>{`本期数加载错误，${error.message}`}</div>
  if(changeReasonError) return <div>{`变动原因加载错误，${error.message}`}</div>

  let previousTB
  let tb
  let changeReasons
  let newData

  try{
    changeReasons = JSON.parse(changeReasonData.getChangeReasons)
  }catch(error){
    return <MySnackbar message="未找到变动原因数据" />
  }

  try{
    previousTB = JSON.parse(previousData.getPreviousTb)
  }catch(error){
    return <MySnackbar message="未找到上期数据" />
  }

  try{
    tb = JSON.parse(data.getTB)
  }catch(error){
    return <MySnackbar message="未发现本期数据" />
  }

  const {tbData,totalPreviousAmount,totalAmount} = getCompareTb(tb,previousTB,statement)
  
  newData=tbData.map(data=>{
    const changes = changeReasons.filter(changeReason=>changeReason.order===data.order)
    if(changes.length>0){
      return {...data,reason:changes[0].reason}
    }else{
      return data
    }
  })

  const columns = [
    {title: '序号',field: 'order'},
    { title: '科目名称', field: 'show' },
    { title: '方向', field: 'direction' },
    { title: '上期已审数', field: 'previousAmount',render:rowData =>fmoney(rowData.previousAmount,2)},
    { title: '上期比例', field: 'previousAmountRatio',render:rowData =>fmoney(rowData.previousAmount/totalPreviousAmount,2) },
    { title: `本期${audit}数`, field: 'amount' ,render:rowData =>fmoney(rowData.amount,2)},
    { title: `本期比例`, field: 'amountRatio' ,render:rowData =>fmoney(rowData.amount/totalAmount,2)},
    { title: `金额变动`, field: 'amountChange' ,render:rowData =>fmoney(rowData.amount-rowData.previousAmount,2)},
    { title: `横向变动比例`, field: 'lateralChange ' ,render:rowData =>Math.abs(rowData.previousAmount)>0 ? fmoney((rowData.amount-rowData.previousAmount)/rowData.previousAmount,2):"新增"},
    { title: `纵向变动比例`, field: 'verticalChange' ,render:rowData =>Math.abs(rowData.previousAmount/totalPreviousAmount)>0 ? fmoney((rowData.amount/totalAmount-rowData.previousAmount/totalPreviousAmount)/(rowData.previousAmount/totalPreviousAmount),2):"新增"},
    { title: `增减变动原因`, field: 'reason'}
  ]
  return (
    <Paper className={classes.root}>
        <ProjectHeader
         onClick={()=>navigate(`/project/${props.projectId}`)}
         title="报表分析性程序"
        />
        <Table
        addChangeReason={addChangeReason}
        statement={statement}
        audit={audit}
        projectId={projectId}
        newData={newData}
        columns={columns}
        />
        
    </Paper>
  );
}