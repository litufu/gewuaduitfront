import React, { useState, Fragment } from 'react';
import { useMutation, useApolloClient } from '@apollo/react-hooks';
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
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import DeleteIcon from '@material-ui/icons/Delete';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { Header, Loading, MySnackbar, SearchInput, SelectCompany } from '../../components'

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
const GET_COLLEAGUES = gql`
    query Colleagues($name: String!) {
        colleagues(name: $name) {
        email
        name
        }
    }
`

const UPDATE_RECORD = gql`
    mutation AddDataRecordUsers($userEmails: [String!]!, $companyName: String!, $startTime: DateTime!,$endTime:DateTime!) {
        addDataRecordUsers(userEmails: $userEmails, companyName: $companyName, startTime: $startTime,endTime:$endTime) {
        id
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
    upload: {
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
    const client = useApolloClient();
    const displayTexts = {
        "company":"1.选择公司",
        "period":"2.选择会计数据起止日期",
        "upload":"3.上传文件",
        "success":"4.文件上传成功！授权数据使用者",
        "over":"上传完成",
    }
    const [companyName, setCompanyName] = useState("")
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [uploads, setUploads] = useState([])
    const [display, setDisplay] = useState("company")
    const [users, setUsers] = useState([])
    const [myColleagues, setMyColleagues] = useState([])
    const [searchText, setSearchText] = useState("")
    const [uploadDataFiles, { loading, error }] = useMutation(
        CREATE_UPLOAD_DATA_FILES,
        {
            onCompleted({ uploadDataFiles }) {
                setDisplay("success")
            }
        }
    );
    const [addDataRecordUsers, { loading: addLoading, error: addError }] = useMutation(
        UPDATE_RECORD,
        {
            onCompleted({ addDataRecordUsers }) {
                setDisplay("over")
            }
        }
    );

    if (loading) return <Loading />;
    if (addLoading) return <Loading />;

    function handleChange({
        target: {
            validity,
            files: [file]
        }
    }, type) {
        if (validity.valid) {
            setUploads([...uploads, { type, file }])
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <Header />
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    上传财务数据
                </Typography>
                    <Typography variant="subtitle1">
                        {displayTexts[display]}
                    </Typography>
                    {
                        (display==="over") &&(<Button 
                            variant="text"
                            color="primary"
                            onClick={()=>setDisplay("company")}
                            >
                                继续上传
                            </Button>)
                    }
                    
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
                                        if (startTimeDate.getDate() !== 1 && startTimeDate.getMonth() !== 0) {
                                            alert("日期设置错误,仅支持1月1日开上传")
                                        } else {
                                            setDisplay("upload")
                                        }
                                    }
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
                                                    onChange={(event) => handleChange(event, "SUBJECTBALANCE")}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="right">上传序时账</TableCell>
                                            <TableCell align="left">
                                                <input
                                                    type="file"
                                                    accept="text/csv"
                                                    onChange={(event) => handleChange(event, "CHRONOLOGICALACCOUNT")}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="right">上传辅助核算余额表</TableCell>
                                            <TableCell align="left">
                                                <input
                                                    type="file"
                                                    accept="text/csv"
                                                    onChange={(event) => handleChange(event, "AUXILIARYACCOUNTING")}
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
                                        uploadDataFiles({
                                            variables: {
                                                uploads,
                                                companyName,
                                                startTime: new Date(startTime),
                                                endTime: new Date(endTime),
                                            }
                                        })
                                    }}
                                >
                                    提交
                                </Button>
                            </Fragment>
                        )
                    }
                    {
                        display === "success" && (
                            <div>
                                <div className={classes.period}>

                                    <List>
                                        {(users.length > 0) && (<Typography variant="h6">
                                            已授权用户
                                    </Typography>)}
                                        {
                                            users.map(user => (
                                                <ListItem key={user.email}>
                                                    <ListItemText
                                                        primary={`${user.name}(${user.email})`}
                                                    />
                                                    <ListItemSecondaryAction
                                                        onClick={() => {
                                                            const newusers = users.filter(u => u.email !== user.email)
                                                            setUsers(newusers)
                                                        }
                                                        }
                                                    >
                                                        <IconButton edge="end" aria-label="delete">
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            ))
                                        }
                                    </List>
                                </div>

                                <SearchInput
                                    value={searchText}
                                    onChange={event => setSearchText(event.target.value)}
                                    placeholder="请输入数据被授权访问者姓名，点击搜索"
                                    onClick={() => client.query({
                                        query: GET_COLLEAGUES,
                                        variables: { name: searchText }
                                    }).then(
                                        ({ data }) => setMyColleagues(data.colleagues)
                                    )
                                    }
                                />

                                <List>
                                    {
                                        myColleagues.length > 0 && (
                                            <Typography variant="h6">
                                                请添加授权用户
                                        </Typography>
                                        )
                                    }

                                    {
                                        myColleagues.map(colleague => (
                                            <ListItem key={colleague.email}>
                                                <ListItemText
                                                    primary={`${colleague.name}(${colleague.email})`}
                                                />
                                                <ListItemSecondaryAction
                                                    onClick={() => setUsers([...users, colleague])}
                                                >
                                                    <IconButton edge="end" aria-label="select">
                                                        <Typography>选择</Typography>
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))
                                    }
                                </List>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    className={classes.button}
                                    onClick={() => {
                                        addDataRecordUsers({
                                            variables: {
                                                userEmails: users.map(user => user.email),
                                                companyName,
                                                startTime: new Date(startTime),
                                                endTime: new Date(endTime),
                                            }
                                        })
                                    }}
                                >
                                    完成
                                </Button>
                            </div>
                        )
                    }
                </form>

                {
                    error && (<MySnackbar message={`数据上传失败${error.message}`} />)
                }
                 {
                    addError && (<MySnackbar message={`数据上传失败${addError.message}`} />)
                }
            </div>
        </Container>
    );
}