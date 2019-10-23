import React from 'react';
import MaterialTable from 'material-table';
import gql from 'graphql-tag';
import { makeStyles } from '@material-ui/core/styles';
import { navigate } from "@reach/router"
import { useQuery ,useMutation} from '@apollo/react-hooks';
import { Loading,ProjectHeader} from '../../components';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
    button: {
      margin: theme.spacing(1),
    },
    input: {
      display: 'none',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    appBar: {
      position: 'relative',
    },
  }));

const GET_ADUIT_ADJUSTMENTS = gql`
  query GetAduitAdjustments($projectId: String!) {
    getAduitAdjustments(projectId: $projectId) 
  }
`;

const CURRENT_ACCOUNT_HEDGING = gql`
  mutation CurrentAccountHedging($projectId: String!) {
    currentAccountHedging(projectId: $projectId) 
  }
`;

const columns = [
    { title: '凭证号', field: 'vocher_num' },
    { title: '凭证种类', field: 'vocher_type' },
    { title: '分录号', field: 'subentry_num', type: 'numeric' },
    {
      title: '摘要',
      field: 'description',
    },
    {
      title: '科目编码',
      field: 'subject_num',
    },
    {
      title: '科目名称',
      field: 'subject_name',
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
    },

  ]


export default function HasTwoSubjectsCompanies(props) {
    const classes = useStyles();
    const [
        currentAccountHedging,
        { loading: mutationLoading, error: mutationError },
      ] = useMutation(CURRENT_ACCOUNT_HEDGING,{
        onCompleted({ currentAccountHedging }) {
              if(currentAccountHedging){
                alert("往来款对冲成功")
              }else{
                alert("往来款对冲失败")
              }
        },
        refetchQueries(){
          return([{
            query: GET_ADUIT_ADJUSTMENTS,
            variables: { projectId: props.projectId },
          }])
        },
      });

    const { loading:auditAdjustmentLoading, error:auditAdjustmentError, data:auditAdjustmentData } = useQuery(GET_ADUIT_ADJUSTMENTS, {
        variables: { projectId:props.projectId },
      });
    
    
      if(auditAdjustmentLoading||mutationLoading) return <Loading />
      if(auditAdjustmentError) return <div>{auditAdjustmentError.message}</div>
      if(mutationError) return <div>{mutationError.message}</div>

      const aduitAdjustments = JSON.parse(auditAdjustmentData.getAduitAdjustments)
      const hedgingAduitAdjustments = aduitAdjustments.filter(adjustment=>adjustment.vocher_type==="冲")

  return (
      <div>
        <ProjectHeader
         onClick={()=>navigate(`/project/${props.projectId}`)}
         title="供应商或客户不同科目同时挂账"
        />
        <Button 
        variant="contained"
        className={classes.button}
        onClick={()=>currentAccountHedging({variables:{projectId:props.projectId}})}
        >
        获取对冲分录
      </Button>
  
    <MaterialTable
      title="往来款对冲科目汇总"
      columns={columns}
      data={hedgingAduitAdjustments}
      options={{
        exportButton: true,
        paging: false,
        search:false
      }}
    />
        
     </div>
  );
}