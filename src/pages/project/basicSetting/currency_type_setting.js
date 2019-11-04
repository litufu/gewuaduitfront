import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { navigate } from "@reach/router"
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { Loading,ProjectHeader} from '../../../components';

const ADD_SUBJECT = gql`
  mutation AddSubject($projectId: String!,$record:String!) {
    addSubject(projectId: $projectId,record:$record) 
  }
`;

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
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
  button: {
    margin: theme.spacing(1),
  },
}));

const subjectTypes = [
  {
    value: '资产',
    label: '资产',
  },
  {
    value: '负债',
    label: '负债',
  },
  {
    value: '权益',
    label: '权益',
  },
  {
    value: '成本',
    label: '成本',
  },
  {
    value: '损益',
    label: '损益',
  },
];

const directions = [
    {
      value: '借',
      label: '借',
    },
    {
      value: '贷',
      label: '贷',
    },
  ];

  const isSpecifics = [
    {
      value: 1,
      label: '是',
    },
    {
      value: 0,
      label: '否',
    },
  ];



export default function AddSubject(props) {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    subjectNum: '',
    subjectName: '',
    subjectType: '资产',
    direction: '借',
    isSpecific:1,
    subjectGradation:1,
  });

  const [
    addSubject,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(ADD_SUBJECT,{
    onCompleted({ addSubject }) {
        setValues({
            subjectNum: '',
            subjectName: '',
            subjectType: '资产',
            direction: '借',
            isSpecific:1,
            subjectGradation:1,
          });
          if(addSubject){
              alert("增加会计科目成功")
          }else{
            alert("增加会计科目失败")
          }
    }
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  return (
      <div>
    <ProjectHeader
    onClick={()=>navigate(`/project/${props.projectId}`)}
    title="增加会计科目"
   />
    <form className={classes.container} noValidate autoComplete="off">
      <TextField
        id="standard-subjectNum"
        label="科目编码"
        className={classes.textField}
        value={values.subjectNum}
        onChange={handleChange('subjectNum')}
        margin="normal"
      />
    <TextField
        id="standard-subjectName"
        label="科目名称"
        className={classes.textField}
        value={values.subjectName}
        onChange={handleChange('subjectName')}
        margin="normal"
      />
      <TextField
        id="standard-select-subjectType"
        select
        label="科目类别"
        className={classes.textField}
        value={values.subjectType}
        onChange={handleChange('subjectType')}
        SelectProps={{
          MenuProps: {
            className: classes.menu,
          },
        }}
        margin="normal"
      >
        {subjectTypes.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        id="standard-select-direction"
        select
        label="方向"
        className={classes.textField}
        value={values.direction}
        onChange={handleChange('direction')}
        SelectProps={{
          MenuProps: {
            className: classes.menu,
          },
        }}
        margin="normal"
      >
        {directions.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        id="standard-select-direction"
        select
        label="是否明细科目"
        className={classes.textField}
        value={values.isSpecific}
        onChange={handleChange('isSpecific')}
        SelectProps={{
          MenuProps: {
            className: classes.menu,
          },
        }}
        margin="normal"
      >
        {isSpecifics.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        id="standard-subjectGradation"
        label="科目等级"
        className={classes.textField}
        value={values.subjectGradation}
        onChange={handleChange('subjectGradation')}
        margin="normal"
      />
     <Button 
     variant="contained" 
     color="primary" 
     className={classes.button}
     onClick={()=>addSubject({variables:{projectId:props.projectId,record:JSON.stringify(values)}})}
     >
        提交
      </Button>
      <Button
      className={classes.button}
      onClick={()=>navigate(`/stdSubject/${props.projectId}`)}
      >
          查看建议会计科目设置
      </Button>
      {mutationLoading && <Loading />}
      {mutationError && <div>{mutationError.message}</div>}
    </form>
    </div>
  );
}