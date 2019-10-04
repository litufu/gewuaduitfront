import React from 'react';
import clsx from 'clsx';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '../../components/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import { Link } from '@reach/router'
import { dateToString } from '../../utils'
import GET_PROJECTS from '../../graphql/get_projects.query'
import { Loading ,Home} from '../../components'

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  button: {
    margin: theme.spacing(1),
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

export default function Main(props) {
  const classes = useStyles();
  const theme = useTheme();
  const { loading, error, data } = useQuery(GET_PROJECTS);
  const [open, setOpen] = React.useState(true);
  const [display,setDisplay] = React.useState("check");

  function handleDrawerOpen() {
    setOpen(true);
  }

  function handleDrawerClose() {
    setOpen(false);
  }

  if(loading) return <Loading />
  if(error) return <div>{error.message}</div>
  
  const project = data.projects.filter(project=>project.id===props.projectId)[0]

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Home/>
          <Typography variant="h6" noWrap>
            {`${project.company.name}  ${dateToString(new Date(project.startTime))}至${dateToString(new Date(project.endTime))}`}
          </Typography>
        </Toolbar>
        
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
            <ListItem button onClick={()=>setDisplay("check")}>
              <ListItemText primary="查账" />
            </ListItem>
            <ListItem button onClick={()=>setDisplay("analytical")}>
              <ListItemText primary="分析性程序表" />
            </ListItem>
            <ListItem button onClick={()=>setDisplay("risk")}>
              <ListItemText primary="风险评估" />
            </ListItem>
            <ListItem button onClick={()=>setDisplay("reportform")}>
              <ListItemText primary="报表" />
            </ListItem>
            <ListItem button onClick={()=>setDisplay("detaillist")}>
              <ListItemText primary="明细表" />
            </ListItem>
            <ListItem button onClick={()=>setDisplay("relatedparty")}>
              <ListItemText primary="关联方交易" />
            </ListItem>
        </List>
        <Divider />
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        {
            display === "check" &&(
                <div>
                  <ListItem>
                    <Typography variant="h6" noWrap>
                      基础设置
                    </Typography>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/addSubject/${project.id}`}>增加会计科目</Link>
                  </Button>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/addAuxiliary/${project.id}`}>增加辅助核算项目</Link>
                  </Button>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/adjustment/${project.id}`}>公式设置</Link>
                  </Button>
                  </ListItem>
                  <ListItem>
                  <Typography variant="h6" noWrap>
                      账务处理
                    </Typography>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/checkProject/${project.id}`}>账务检查</Link>
                    </Button>
                    <Button color="primary" className={classes.button}>
                  <Link to={`/checkProfitAndLossCarryOver/${project.id}`}>检查损益结转科目</Link>
                    </Button>
                  </ListItem>
                  <ListItem>
                  <Typography variant="h6" noWrap>
                      查账
                    </Typography>
                    <Button color="primary" className={classes.button}>
                  <Link to={`/getSubjectBalcance/${project.id}`}>科目余额表</Link>
                  </Button>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/auxiliary/${project.id}`}>辅助核算明细表</Link>
                  </Button>
                  </ListItem>
                  <ListItem>
                  <Typography variant="h6" noWrap>
                      试算平衡
                    </Typography>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/tb/${project.id}`}>试算平衡表</Link>
                  </Button>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/adjustment/${project.id}`}>调整分录列表</Link>
                  </Button>
                  </ListItem>
                  <ListItem>
                  <Typography variant="h6" noWrap>
                    分析性程序
                    </Typography>  
                    <Button color="primary" className={classes.button}>
                  <Link to={`/entryClassify/${project.id}`}>会计分录分析</Link>
                  </Button>
                  </ListItem>
                  <ListItem>
                  <Typography variant="h6" noWrap>
                    未审数分析
                    </Typography>  
                  <Button color="primary" className={classes.button}>
                  <Link to={`/balanceSheetUnAudited/${project.id}`}>资产负债表分析（未审数）</Link>
                  </Button>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/profitStatementUnAudited/${project.id}`}>利润表分析（未审数）</Link>
                  </Button>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/tb/${project.id}`}>比率分析（未审数）</Link>
                  </Button>
                  </ListItem>
                  <ListItem>
                  <Typography variant="h6" noWrap>
                  已审数分析
                    </Typography>  
                  <Button color="primary" className={classes.button}>
                  <Link to={`/balanceSheetAudited/${project.id}`}>资产负债表分析（已审数）</Link>
                  </Button>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/profitStatementAudited/${project.id}`}>利润表分析（已审数）</Link>
                  </Button>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/adjustment/${project.id}`}>比率分析（已审数）</Link>
                  </Button>
                  </ListItem>
                  
                  <ListItem>
                  <Typography variant="h6" noWrap>
                    风险评估
                    </Typography>
                    <Button color="primary" className={classes.button}>
                  <Link to={`/importance/${project.id}`}>重要性水平</Link>
                  </Button>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/identifiedRisks/${project.id}`}>已识别风险汇总表</Link>
                  </Button>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/importantAccount/${project.id}`}>重大账户和交易</Link>
                  </Button>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/adjustment/${project.id}`}>进一步审计程序设计</Link>
                  </Button>
                  </ListItem>
                  <ListItem>
                  <Typography variant="h6" noWrap>
                    报表
                    </Typography>
                    <Button color="primary" className={classes.button}>
                  <Link to={`/tb/${project.id}`}>资产负债表</Link>
                  </Button>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/tb/${project.id}`}>利润表</Link>
                  </Button>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/adjustment/${project.id}`}>现金流量表</Link>
                  </Button>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/adjustment/${project.id}`}>现金流量表附表</Link>
                  </Button>
                  </ListItem>
                  
                </div>
                
            )
        }
        {
            display === "analytical" &&(
                <div>
                    <Button color="primary" className={classes.button}>资产负债表分析性程序</Button>
                    <Button color="primary" className={classes.button}>利润表分析性程序</Button>
                    <Button color="primary" className={classes.button}>现金流量表分析性程序</Button>
                    <Button color="primary" className={classes.button}>比率分析</Button>
                    <Button color="primary" className={classes.button}>分录统计分析</Button>
                </div>
                
            )
        }
         {
            display === "risk" &&(
                <div>
                    <Button color="primary" className={classes.button}>重要性水平</Button>
                    <Button color="primary" className={classes.button}>重大账户和交易</Button>
                    <Button color="primary" className={classes.button}>可能存在的错报</Button>
                    <Button color="primary" className={classes.button}>可能存在的舞弊</Button>
                </div>
                
            )
        }
        {
            display === "reportform" &&(
                <div>
                    <Button color="primary" className={classes.button}>资产负债表</Button>
                    <Button color="primary" className={classes.button}>利润表</Button>
                    <Button color="primary" className={classes.button}>现金流量表</Button>
                    <Button color="primary" className={classes.button}>现金流量表附表</Button>
                    <Button color="primary" className={classes.button}>试算平衡表</Button>
                </div>
                
            )
        }
        {
            display === "detaillist" &&(
                <div>
                    <Button color="primary" className={classes.button}>货币资金</Button>
                    <Button color="primary" className={classes.button}>应收账款</Button>
                    <Button color="primary" className={classes.button}>营业收入</Button>
                </div>
                
            )
        }
        {
            display === "relatedparty" &&(
                <div>
                    <Button color="primary" className={classes.button}>重大客户关联方校验</Button>
                    <Button color="primary" className={classes.button}>重大供应商关联方校验</Button>
                    <Button color="primary" className={classes.button}>往来款关联方校验</Button>
                    <Button color="primary" className={classes.button}>关联方交易明细表</Button>
                    <Button color="primary" className={classes.button}>关联方交易余额表</Button>
                </div>
                
            )
        }
      </main>
      </div>
  );
}