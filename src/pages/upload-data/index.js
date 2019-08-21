import React, { useState, Fragment } from 'react';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Header,Loading,MySnackbar } from '../../components'
import SelectCompany from './select-company'

const CREATE_UPLOAD_DATA_FILES = gql`
  mutation UploadDataFiles($uploads: [UploadTypeInput!]!, $companyName: String!, $startTime: DateTime!,$endTime:DateTime!) {
    uploadDataFiles(uploads: $uploads, companyName: $companyName, startTime: $startTime,endTime:$endTime) {
      path
      filename
      mimetype
      type
    }
  }
`


const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: "column",
        alignItems: "center"
    },
    period: {
        display: 'flex',
        flexDirection: "row",
        alignItems: "center"
    },
    table: {
        minWidth: 650,
      },
    upload:{
        display: 'flex',
        flexDirection: "row",
        alignItems: "center"
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 500,
    },
    datetField: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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


export default function UploadData() {
    const classes = useStyles();
    const [companyName, setCompanyName] = useState("")
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [uploads, setUploads] = useState([])
    const [display, setDisplay] = useState("company")



    function handleChange({
        target: {
          validity,
          files: [file]
        }
      },type) {
          if(validity.valid ){
            setUploads([...uploads,{type,file}])
          }
    }

    const [uploadDataFiles, { loading, error }] = useMutation(
        CREATE_UPLOAD_DATA_FILES,
      {
        onCompleted({ uploadDataFiles }) {
          setDisplay("success")
        }
      }
    );

    if (loading) return <Loading />;

    return (
        <Container component="main" maxWidth="xs">
            <Header />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    上传财务数据
                </Typography>
                {display === "company" && (
                    <Typography variant="subtitle1">
                        1.选择公司
                    </Typography>
                )}
                {display === "period" && (
                    <Typography variant="subtitle1">
                        2.选择会计数据起止日期
                    </Typography>
                )}
                {display === "upload" && (
                    <Typography variant="subtitle1">
                        3.上传文件
                    </Typography>
                )}
                 {display === "success" && (
                    <Typography variant="subtitle1">
                        文件上传成功！
                    </Typography>
                )}
                <form className={classes.container} noValidate autoComplete="off">
                    {
                        display === "company" && (
                            <SelectCompany
                                handleSelect={(selection) => {
                                    setCompanyName(selection)
                                    setDisplay("period")
                                }}
                            />
                        )
                    }
                    {
                        display === "period" && (
                            <div>
                                <div className={classes.period}>
                                    <TextField
                                        id="date1"
                                        label="起始日期"
                                        type="date"
                                        className={classes.datetField}
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    <Typography variant="body1">
                                        至
                                    </Typography>
                                    <TextField
                                        id="date2"
                                        label="截止日期"
                                        type="date"
                                        className={classes.datetField}
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        margin="normal"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />

                                </div>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    className={classes.button}
                                    onClick={() => { 
                                        const startTimeDate = new Date(startTime)
                                        if(startTimeDate.getDate()!==1 && startTimeDate.getMonth()!==0){
                                            alert("日期设置错误,仅支持1月1日开上传")
                                        }else{
                                            setDisplay("upload")
                                        }}
                                    }
                                >
                                    下一步
                 </Button>
                            </div>
                        )
                    }
                    {
                        display === "upload" && (
                            <Fragment >
                                <Table className={classes.table} >
                                    <TableBody>
                                    <TableRow>
                                        <TableCell align="right">上传科目余额表</TableCell>
                                        <TableCell align="left">
                                            <input 
                                            type="file"
                                            accept="text/csv"
                                            onChange={(event)=>handleChange(event,"SUBJECTBALANCE")}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="right">上传序时账</TableCell>
                                        <TableCell align="left">
                                        <input 
                                            type="file"
                                            accept="text/csv"
                                            onChange={(event)=>handleChange(event,"CHRONOLOGICALACCOUNT")}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align="right">上传辅助核算余额表</TableCell>
                                        <TableCell align="left">
                                            <input 
                                            type="file"
                                            accept="text/csv"
                                            onChange={(event)=>handleChange(event,"AUXILIARYACCOUNTING")}
                                            />
                                        </TableCell>
                                    </TableRow>
                                    </TableBody>
                                </Table>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    className={classes.button}
                                    onClick={() => {
                                        uploadDataFiles({variables:{
                                            uploads,
                                            companyName,
                                            startTime:new Date(startTime),
                                            endTime:new Date(endTime),
                                        }})
                                    }}
                                >
                                    提交
                </Button>
                            </Fragment>
                        )
                    }

                </form>
                
                {
                error && (<MySnackbar message={`数据上传失败${error.message}`} />)
                }
            </div>
        </Container>
    );
}
