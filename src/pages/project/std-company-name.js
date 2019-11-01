import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Loading,ProjectHeader} from '../../components';
import { navigate } from "@reach/router"
import gql from 'graphql-tag';
import { useMutation,useQuery } from '@apollo/react-hooks';

const SET_STANDARDIZED_ACCOUNT_NAME = gql`
  mutation setStandardizedAccountName($projectId: String!) {
    setStandardizedAccountName(projectId: $projectId) 
  }
`;

const ADD_STD_COMPANY_NAME = gql`
  mutation addStdCompanyName($projectId: String!,$originName:String!,$stdName:String!) {
    addStdCompanyName(projectId: $projectId,originName:$originName,stdName:$stdName) {
        id
        originName
        stdName
    }
  }
`;

const GET_STD_COMPANY_NAMES = gql`
  query getStdCompanyNames($projectId: String!) {
    getStdCompanyNames(projectId: $projectId){
        id
        originName
        stdName
    } 
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



export default function StdCompanyName(props) {
  const classes = useStyles();
  const [values, setValues] = React.useState({
    originName: '',
    stdName: '',
  });

  const { loading, error, data } = useQuery(GET_STD_COMPANY_NAMES, {
    variables: { projectId:props.projectId },
  });

  const [
    addStdCompanyName,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(ADD_STD_COMPANY_NAME,{
    onCompleted({ addStdCompanyName }) {
        setValues({
            originName: '',
            stdName: '',
        });
    },
    refetchQueries(){
      return([{
        query: GET_STD_COMPANY_NAMES,
        variables: { projectId: props.projectId },
      }])
    },
  });

  const [
    setStandardizedAccountName,
    { loading: setLoading, error: setError },
  ] = useMutation(SET_STANDARDIZED_ACCOUNT_NAME,{
    onCompleted({ setStandardizedAccountName }) {
       if(setStandardizedAccountName){
           alert("名称标准化成功")
       }else{
            alert("名称标准化失败")
       }
    }});

  if(loading) return <Loading />
  if(error) return <div>{error.message}</div>

  const columns = [
    { title: '原始名称', field: 'originName' },
    { title: '标准名称', field: 'stdName' },
  ]

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  return (
      <div>
    <ProjectHeader
    onClick={()=>navigate(`/project/${props.projectId}`)}
    title="标准化供应商或客户名称"
   />
    <form className={classes.container} noValidate autoComplete="off">
      <TextField
        id="standard-originName"
        label="原始名称"
        className={classes.textField}
        value={values.originName}
        onChange={handleChange('originName')}
        margin="normal"
      />
    <TextField
        id="standard-stdName"
        label="标准全名"
        className={classes.textField}
        value={values.stdName}
        onChange={handleChange('stdName')}
        margin="normal"
      />
     <Button 
     variant="contained" 
     color="primary" 
     className={classes.button}
     onClick={()=>addStdCompanyName({variables:{projectId:props.projectId,originName:values.originName,stdName:values.stdName}})}
     >
        添加
      </Button>
      {mutationLoading && <Loading />}
      {mutationError && <div>{mutationError.message}</div>}
      <Button 
     variant="contained" 
     color="primary" 
     className={classes.button}
     onClick={()=>setStandardizedAccountName({variables:{projectId:props.projectId}})}
     >
        标准化账套内名称
      </Button>
      {setLoading && <Loading />}
      {setError && <div>{setError.message}</div>}
    </form>
    <MaterialTable
      title="客户和供应商名称修改对照表"
      columns={columns}
      data={data.getStdCompanyNames}
      options={{
        exportButton: true,
        paging: false,
      }}
    />
    </div>
  );
}