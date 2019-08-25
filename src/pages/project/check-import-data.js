import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { Loading,ProjectHeader} from '../../components';
import { navigate } from "@reach/router"

const CHECK_IMPORT_DATA = gql`
    query CheckImportData($projectId: String!) {
        checkImportData(projectId: $projectId) 
  }
`

const useStyles = makeStyles({
  root: {
    width: '100%',
    maxWidth: 500,
  },
});



export default function CheckProject(props) {
  const classes = useStyles();
  const { loading, error, data } = useQuery(CHECK_IMPORT_DATA, {
    variables: { projectId:props.projectId },
  });

  if(loading) return <Loading />
  if(error) return <div>{error.message}</div>


  return (
    <div className={classes.root}>
        <ProjectHeader
         onClick={()=>navigate(`/project/${props.projectId}`)}
         title="账务检查"
        />
      <Typography variant="h6" gutterBottom>
        审核内容：
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        1、检查导入的科目余额表与序时账数据是否一致
      </Typography>
      <Typography variant="subtitle2" gutterBottom>
        2、检查导入的辅助核算明细表与科目余额表是否一致
      </Typography>
      <Typography variant="h6" gutterBottom>
        {`审核结论：${data.checkImportData ? "检查一致":"检查不一致"}`}
      </Typography>
    </div>
  );
}