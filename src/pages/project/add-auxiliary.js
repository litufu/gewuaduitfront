import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Loading,ProjectHeader} from '../../components';
import { navigate } from "@reach/router"
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

const ADD_AUXILIARY = gql`
  mutation AddAuxiliary($projectId: String!,$record:String!) {
    addAuxiliary(projectId: $projectId,record:$record) 
  }
`;
const GET_AUXILIARIES = gql`
  query getAuxiliaries($projectId: String!) {
    getAuxiliaries(projectId: $projectId) 
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

const directions = [
    {
      value: '借',
      label: '借',
    },
    {
      value: '贷',
      label: '贷',
    },
  ]

export default function AddAuxiliary(props) {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    subjectNum: '',
    subjectName: '',
    typeNum: 1,
    typeName: '',
    code:"",
    name:"",
    direction:"借"
  });

  const [
    addAuxiliary,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(ADD_AUXILIARY,{
    onCompleted({ addAuxiliary }) {
          if(addAuxiliary){
              alert("增加辅助核算项目成功")
              setValues({
                subjectNum: '',
                subjectName: '',
                typeNum: 1,
                typeName: '',
                code:"",
                name:"",
                direction:"借"
              });
          }else{
            alert("增加辅助核算项目失败")
          }
    },
    refetchQueries(){
      return([{
        query: GET_AUXILIARIES,
        variables: { projectId: props.projectId },
      }])
    },
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  return (
      <div>
    <ProjectHeader
    onClick={()=>navigate(`/project/${props.projectId}`)}
    title="增加辅助核算项目"
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
        id="standard-typeNum"
        label="辅助核算类别编码"
        className={classes.textField}
        value={values.typeNum}
        onChange={handleChange('typeNum')}
        margin="normal"
      />
       <TextField
        id="standard-typeName"
        label="辅助核算类别名称"
        className={classes.textField}
        value={values.typeName}
        onChange={handleChange('typeName')}
        margin="normal"
      />
       <TextField
        id="standard-code"
        label="辅助核算项目编码"
        className={classes.textField}
        value={values.code}
        onChange={handleChange('code')}
        margin="normal"
      />
      <TextField
        id="standard-name"
        label="辅助核算项目名称"
        className={classes.textField}
        value={values.name}
        onChange={handleChange('name')}
        margin="normal"
      />
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
      
     <Button 
     variant="contained" 
     color="primary" 
     className={classes.button}
     onClick={()=>addAuxiliary({variables:{projectId:props.projectId,record:JSON.stringify(values)}})}
     >
        提交
      </Button>
      <Button
      className={classes.button}
      onClick={()=>navigate(`/auxiliary/${props.projectId}`)}
      >
          查看已有辅助核算项目
      </Button>
      {mutationLoading && <Loading />}
      {mutationError && <div>{mutationError.message}</div>}
    </form>
    </div>
  );
}