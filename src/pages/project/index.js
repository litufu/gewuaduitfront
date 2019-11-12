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
import { Loading ,Home,Work} from '../../components'

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
  const [display,setDisplay] = React.useState("look");

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
          <Work/>
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
            <ListItem button onClick={()=>setDisplay("look")}>
              <ListItemText primary="审计底稿" />
            </ListItem>
            {/* <ListItem button onClick={()=>setDisplay("settings")}>
              <ListItemText primary="基础设置" />
            </ListItem>
            <ListItem button onClick={()=>setDisplay("check")}>
              <ListItemText primary="账务检查" />
            </ListItem>
            <ListItem button onClick={()=>setDisplay("currentAccountCheck")}>
              <ListItemText primary="往来检查" />
            </ListItem>

            <ListItem button onClick={()=>setDisplay("tb")}>
              <ListItemText primary="试算平衡" />
            </ListItem>
            <ListItem button onClick={()=>setDisplay("analyse")}>
              <ListItemText primary="分析性程序" />
            </ListItem>
            <ListItem button onClick={()=>setDisplay("riskAnalysis")}>
              <ListItemText primary="风险评估" />
            </ListItem> */}
            {/* <ListItem button onClick={()=>setDisplay("fs")}>
              <ListItemText primary="报表" />
            </ListItem>
            <ListItem button onClick={()=>setDisplay("fs")}>
              <ListItemText primary="明细表" />
            </ListItem>
            <ListItem button onClick={()=>setDisplay("fs")}>
              <ListItemText primary="附注" />
            </ListItem> */}
            <ListItem button onClick={()=>setDisplay("tools")}>
              <ListItemText primary="工具箱" />
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
            display === "look" &&(
                <div>
                   <Typography variant="subtitle1" noWrap>
                      账务检查处理
                    </Typography>
                    {/* <Button color="primary" className={classes.button}>
                  <Link to={`/projectInitData/${project.id}`}>数据初始化</Link>
                    </Button> */}
                  <Button color="primary" className={classes.button}>
                  <Link to={`/checkProject/${project.id}`}>核对科目余额表、序时账及辅助核算</Link>
                    </Button>
                    <Button color="primary" className={classes.button}>
                  <Link to={`/checkProfitAndLossCarryOver/${project.id}`}>检查损益结转科目</Link>
                    </Button>
                    <Button color="primary" className={classes.button}>
                  <Link to={`/compareThisStartToLastEnd/${project.id}`}>比较本期初与上期末</Link>
                    </Button>
                    <Divider />
                    <Typography variant="subtitle1" noWrap>
                      基础设置
                    </Typography>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/addSubject/${project.id}`}>增加会计科目</Link>
                  </Button>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/addAuxiliary/${project.id}`}>增加辅助核算项目</Link>
                  </Button>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/ageSetting/${project.id}`}>账龄设置</Link>
                  </Button>
                {/* <Button color="primary" className={classes.button}>
                <Link to={`/currencyTypeSetting/${project.id}`}>记账本位币</Link>
                </Button> */}
                  <Button color="primary" className={classes.button}>
                  <Link to={`/letterOfProofSetting/${project.id}`}>函证抽查设置</Link>
                  </Button>
                  <Divider/>
                  <Typography variant="subtitle1" noWrap>
                      查账
                    </Typography>
                    <Button color="primary" className={classes.button}>
                  <Link to={`/getSubjectBalcance/${project.id}`}>科目余额表</Link>
                  </Button>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/auxiliary/${project.id}`}>辅助核算明细表</Link>
                  </Button>
                  <Divider/>
                  <Typography variant="subtitle1" noWrap>
                      试算平衡
                    </Typography>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/tb/${project.id}`}>试算平衡表</Link>
                  </Button>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/adjustment/${project.id}`}>调整分录列表</Link>
                  </Button>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/profitDistribution/${project.id}`}>期初未分配利润计算表</Link>
                  </Button>
                  <Divider/>
                  <Typography variant="subtitle1" noWrap>
                    账务分析
                    </Typography>  
                    <Button color="primary" className={classes.button}>
                  <Link to={`/entryClassify/${project.id}`}>会计分录分析</Link>
                  </Button>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/checkEntry/${project.id}`}>凭证抽查</Link>
                  </Button>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/supplier/${project.id}`}>供应商分析</Link>
                  </Button>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/customer/${project.id}`}>客户分析</Link>
                  </Button>
                  <Divider />
                  <Typography variant="subtitle1" noWrap>
                    报表未审数分析
                    </Typography>  
                  <Button color="primary" className={classes.button}>
                  <Link to={`/balanceSheetUnAudited/${project.id}`}>资产负债表分析（未审数）</Link>
                  </Button>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/profitStatementUnAudited/${project.id}`}>利润表分析（未审数）</Link>
                  </Button>
                  {/* <Button color="primary" className={classes.button}>
                  <Link to={`/tb/${project.id}`}>比率分析（未审数）</Link>
                  </Button> */}
                  <Divider/>
                  <Typography variant="subtitle1" noWrap>
                  报表已审数分析
                    </Typography>  
                  <Button color="primary" className={classes.button}>
                  <Link to={`/balanceSheetAudited/${project.id}`}>资产负债表分析（已审数）</Link>
                  </Button>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/profitStatementAudited/${project.id}`}>利润表分析（已审数）</Link>
                  </Button>
                  {/* <Button color="primary" className={classes.button}>
                  <Link to={`/adjustment/${project.id}`}>比率分析（已审数）</Link>
                  </Button> */}
                  <Divider/>
                  <Typography variant="subtitle1" noWrap>
                      往来检查分析
                    </Typography>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/customerIsSupplier/${project.id}`}>既是供应商又是客户的单位</Link>
                    </Button>
                    <Button color="primary" className={classes.button}>
                  <Link to={`/hasTwoSubjectsCompanies/${project.id}`}>往来款多科目挂账</Link>
                    </Button>
                    <Button color="primary" className={classes.button}>
                  <Link to={`/computeAccountAge/${project.id}`}>账龄计算</Link>
                    </Button>
                    {/* <Button color="primary" className={classes.button}>
                  <Link to={`/computeAccountAge/${project.id}`}>期后回款计算</Link>
                    </Button> */}
                    <Button color="primary" className={classes.button}>
                  <Link to={`/accountList/${project.id}`}>往来清单</Link>
                    </Button>
                    <Button color="primary" className={classes.button}>
                  <Link to={`/letterOfProof/${project.id}`}>往来函证明细表</Link>
                    </Button>
                    {/* <Button color="primary" className={classes.button}>
                  <Link to={`/letterOfProof/${project.id}`}>往来函证统计表</Link>
                    </Button> */}
                    <Divider/>
                  <Typography variant="subtitle1" noWrap>
                      工商信息检查
                    </Typography>
                    <Button color="primary" className={classes.button}>
                  <Link to={`/holdersAndMangers/${project.id}`}>获取公司股东及高管信息</Link>
                  </Button>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/downloadCustomerAndSupplierInfo/${project.id}`}>获取重大客户和供应商工商信息</Link>
                  </Button>
                  <Button color="primary" className={classes.button}>
                  <Link to={`/stdCompanyName/${project.id}`}>标准化客户和供应商名称</Link>
                  </Button>
                    <Button color="primary" className={classes.button}>
                  <Link to={`/checkImportantCustomer/${project.id}`}>重要客户工商信息检查</Link>
                    </Button>
                    <Button color="primary" className={classes.button}>
                  <Link to={`/checkImportantSupplier/${project.id}`}>重要供应商工商信息检查</Link>
                    </Button>
                    <Divider/>
                    <Typography variant="subtitle1" noWrap>
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
                  {/* <Button color="primary" className={classes.button}>
                  <Link to={`/adjustment/${project.id}`}>进一步审计程序设计</Link>
                  </Button> */}
                  <Divider/>
                </div>
                
            )
        }
        {
            display === "tools" &&(
                <div>
                  <Typography variant="subtitle1" noWrap>
                      工具箱
                    </Typography>
                    <Button color="primary" className={classes.button}>
                  <Link to={`/getRate/${project.id}`}>汇率查询</Link>
                  </Button>
                 
                  <Divider/>
                </div>
                
            )
        }
        {
            display === "fs" &&(
                <div>
                   <Typography variant="subtitle1" noWrap>
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
                  <Divider/>
                </div>
                
            )
        }
      </main>
      </div>
  );
}