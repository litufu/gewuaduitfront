import React from 'react';
import _ from "lodash"
import MaterialTable from 'material-table';
import { makeStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import { navigate } from "@reach/router"
import { useQuery,useMutation } from '@apollo/react-hooks';
import { Loading,ProjectHeader,ModifyAduitAdjustment} from '../../components';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';

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

const DELETE_ADUIT_ADJUSTMENT = gql`
  mutation DeleteAdutiAdjustment($projectId: String!,$vocherNum:Int!) {
    deleteAdutiAdjustment(projectId: $projectId,vocherNum:$vocherNum) 
  }
`;

export default function MaterialTableDemo(props) {
  const classes = useStyles();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [deleteVocherNum,setDeleteVocherNum] = React.useState(1);
  const [deleteVocherType,setDeleteVocherType] = React.useState("审");
  const [modifyDialogOpen, setModifyDialogOpen] = React.useState(false);

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
  
  const { loading, error, data } = useQuery(GET_ADUIT_ADJUSTMENTS, {
    variables: { projectId:props.projectId },
  });

  const [
    deleteAdutiAdjustment,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(DELETE_ADUIT_ADJUSTMENT,{
    refetchQueries(){
      return([
        {
          query: GET_ADUIT_ADJUSTMENTS,
          variables: { projectId: props.projectId },
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
    onCompleted({ deleteAdutiAdjustment }) {
      setDeleteDialogOpen(false);
    }
  });

  const handleClickDeleteDialogOpen = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };
  const handleClickModifyDialogOpen = () => {
    setModifyDialogOpen(true);
  };

  const handleModifyDialogClose = () => {
    setModifyDialogOpen(false);
  };
  const handleDelete=()=>{
    deleteAdutiAdjustment({ variables: { projectId:props.projectId, vocherNum: deleteVocherNum,vocherType:deleteVocherType } });
  }

  if(loading) return <Loading />
  if(error) return <div>{error.message}</div>
  const aduitAdjustments = JSON.parse(data.getAduitAdjustments)

  return (
      <div>
        <ProjectHeader
         onClick={()=>navigate(`/project/${props.projectId}`)}
         title="科目余额表"
        />
        <Button 
        variant="contained"
        className={classes.button}
        onClick={()=>navigate(`/entry/${props.projectId}`)}
        >
        新增分录
      </Button>
      <Button 
      variant="contained" 
      color="primary" 
      className={classes.button}
      onClick={handleClickModifyDialogOpen}
      >
        修改分录
      </Button>
      <Dialog fullScreen open={modifyDialogOpen} onClose={handleModifyDialogClose} >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleModifyDialogClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              修改调整分录
            </Typography>
          </Toolbar>
        </AppBar>
        <ModifyAduitAdjustment
        projectId={props.projectId}
        vocherNums={_.uniq(aduitAdjustments.filter(adjustment=>adjustment.vocher_type==="审").map(aduitAdjustment=>aduitAdjustment.vocher_num))}
        />
      </Dialog>
      <Button 
      variant="contained" 
      color="secondary" 
      className={classes.button}
      onClick={handleClickDeleteDialogOpen}
      >
        删除分录
      </Button>
      <Dialog open={deleteDialogOpen} onClose={handleDeleteDialogClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">删除审计调整分录</DialogTitle>
        <DialogContent>
          <FormControl className={classes.formControl}>
        <InputLabel htmlFor="age-simple">选择凭证号</InputLabel>
        <Select
          value={deleteVocherNum}
          onChange={(event)=>setDeleteVocherNum(event.target.value)}
        >
          {
            _.uniq(aduitAdjustments.map(aduitAdjustment=>aduitAdjustment.vocher_num)).map(vocherNum=>(
              <MenuItem value={vocherNum} key={vocherNum}>{vocherNum}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="age-simple">选择凭证种类</InputLabel>
        <Select
          value={deleteVocherType}
          onChange={(event)=>setDeleteVocherType(event.target.value)}
        >
        
            <MenuItem value="审">审</MenuItem>
            <MenuItem value="冲">冲</MenuItem>
        </Select>
      </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            取消
          </Button>
          <Button onClick={handleDelete} color="primary">
            确认
          </Button>
        </DialogActions>
        {mutationLoading && <Loading />}
        {mutationError && <div>{mutationError.message}</div>}
      </Dialog>
    <MaterialTable
      title="审计调整分录"
      columns={columns}
      data={aduitAdjustments}
      options={{
        exportButton: true,
        paging: false,
        search:false
      }}
    />
    </div>
  );
}