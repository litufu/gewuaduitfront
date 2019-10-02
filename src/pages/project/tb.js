import React,{useState} from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import MaterialTable from 'material-table';
import { navigate } from "@reach/router"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import { Loading,ProjectHeader} from '../../components';
import {fmoney} from '../../utils'

const GET_TB = gql`
  query GetTB($projectId: String!,$type:String!) {
    getTB(projectId: $projectId,type:$type) 
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



export default function TB(props) {
  const classes = useStyles();
  const [display,setDisplay] = useState(true)
  const { loading:unAuditedLoading, error:unAuditedError, data:unAuditedData } = useQuery(GET_TB, {
    variables: { projectId:props.projectId ,type:"unAudited"},
  });
  const { loading:adjustmentLoading, error:adjustmentError, data:adjustmentData } = useQuery(GET_TB, {
    variables: { projectId:props.projectId ,type:"adjustment"},
    fetchPolicy:"network-only"
  });
 

  if(unAuditedLoading||adjustmentLoading) return <Loading />

  if(unAuditedError) return <div>{`未审数加载错误，${unAuditedError.message}`}</div>
  if(adjustmentError) return <div>{`调整数加载错误，${adjustmentError.message}`}</div>



  const newUnAuditedData = JSON.parse(unAuditedData.getTB)
  const newAdjustmentData = JSON.parse(adjustmentData.getTB)
  let newData = newUnAuditedData.map(data=>{
    const adjustdata = newAdjustmentData.filter(adjustment=>adjustment.order===data.order)
    const adjustment = adjustdata[0].amount
    return {...data,adjustment}
  })
  if(display){
    newData=newData.filter(data=>(Math.abs(data.amount)>0.00)||(Math.abs(data.adjustment)>0.00))
  }
  
  const columns = [
    {title: '序号',field: 'order'},
    { title: '科目名称', field: 'show' },
    { title: '方向', field: 'direction' },
    { title: '未审数', field: 'amount',render:rowData =>fmoney(rowData.amount,2)},
    { title: '审计调整数', field: 'adjustment',render:rowData =>fmoney(rowData.adjustment,2) },
    { title: '审定数', field: 'audited' ,render:rowData =>fmoney(rowData.amount+rowData.adjustment,2)},
  ]
  return (
    <Paper className={classes.root}>
        <ProjectHeader
         onClick={()=>navigate(`/project/${props.projectId}`)}
         title="科目余额表"
        />
         <FormControlLabel
         className={classes.formControl}
        control={
          <Switch
            checked={display}
            onChange={event=>setDisplay(event.target.checked)}
            color="primary"
          />
        }
        label="只显示有数据的行"
      />
       <Button variant="contained" color="primary" className={classes.button}
       onClick={()=>navigate(`/entry/${props.projectId}`)}
       >
                  添加调整分录
                    </Button>
      <MaterialTable
            title="试算平衡表"
            columns={columns}
            data={newData}
            options={{
                exportButton: true,
                paging: false,
              }}
      />
    </Paper>
  );
}