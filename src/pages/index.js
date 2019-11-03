import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Login from './login'
import Divider from '@material-ui/core/Divider';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function SimpleTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="目标和愿景" {...a11yProps(0)} />
          <Tab label="审计功能" {...a11yProps(1)} />
          <Tab label="使用流程" {...a11yProps(2)} />
          <Tab label="联系我们" {...a11yProps(3)} />
          <Tab label="注册/登陆" {...a11yProps(4)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Typography variant="h5" display="inline" gutterBottom>格物在线审计系统</Typography>是一款在线、智能化审计系统。
        <Typography variant="subtitle2" gutterBottom>
          1、底稿一处更新、处处更新
          </Typography>
          <Typography variant="body2" gutterBottom>
            以审计调整分录为基准，审计调整分录改变后，试算平衡表、报表分析性程序、重要性水平、风险评估表、凭证抽查表等相关底稿全部更新。避免人工每次调整一个数，所有底稿、报表和附注全部手动改一遍的麻烦。
          </Typography>
        <Typography variant="subtitle2" gutterBottom>
        2、将事务所的底稿变废为宝
        </Typography>
        <Typography variant="body2" gutterBottom>
          底稿是会计师事务所最宝贵的资源，但由于纸质底稿不易于携带、不易于查询，所以纸质底稿一般会被堆放在仓库里等着发霉。如此宝贵的数据资源被白白的浪费掉。
          格物在线审计软件，在线统一标准化底稿，让你可以随时查看以前年度的底稿，并且可以在统一的数据库资源上开发利用，提升会计师事务所的行业投研能力，为事务所提供咨询业务提供有力的支撑。
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
        3、自动化、智能化
        </Typography>
        <Typography variant="body2" gutterBottom>
          （1）自动计算科目余额表与序时账、辅助核算明细表是否勾稽一致。<br/>
           (2) 自动生成试算平衡表。<br/>
           (3) 自动进行会计分录分析，并抽查出可能存在问题的凭证分录。<br/>
           (4) 自动进行报表分析性程序。<br/>
           (5) 自动计算重要性水平。<br/>
           (6) 自动识别可能存在的潜在错报。<br/>
           (7) 自动识别重大账户和交易及可能存在重大错报的相关认定。<br/>
           (8) 自动供应商分析。<br/>
           (9) 自动对客户进行分析。<br/>
           (10) 自动进行账龄分析。<br/>
           (11) 自动现金流量表计算。<br/>
           (12) 自动生成财务尽职调查报告。<br/>
           (13) 自动财务报表<br/>
           。。。。
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
        4、审计迈入超详细审计时代。
        </Typography>
        <Typography variant="body2" gutterBottom>
          由于审计人员数量和时间的限制，我们现在无法对所有的凭证进行检查复核。现在我们可以将会计准则变为计算机程序，然后使用计算机程序来检查每一笔凭证。由于计算机运算速度是人类检查凭证的上万倍并且可以不间断工作，因此我们可以在底层实施超详细审计。
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
        5、大幅节省内勤工作时间。
        </Typography>
        <Typography variant="body2" gutterBottom>
          使内勤工作自动化、智能化，大幅减少注册会计师的工作量，让注册会计师能够享有正常人的休息时间，过正常人的生活。让事务所告别人海战术，大幅节省劳动力成本。
        </Typography>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Typography variant="h6" gutterBottom>
          已经实现的主要审计功能
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          1、试算平衡表功能
        </Typography>
        <Typography variant="body2" gutterBottom>
            根据序时账和科目余额表自动生成试算平衡表，并且可以输入审计调整分录，试算平衡表及其他相关底稿自动更新。
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
          2、账务核对功能
        </Typography>
        <Typography variant="body2" gutterBottom>
            自动计算序时账、科目余额表和辅助核算明细表是否勾稽一致。
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
          3、报表分析性程序
        </Typography>
        <Typography variant="body2" gutterBottom>
            自动生成未审资产负债表、未审利润表、已审资产负债表、已审利润表分析性程序。
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
          4、会计分录分析和凭证抽查
        </Typography>
        <Typography variant="body2" gutterBottom>
            依据知识图谱对每笔会计分录进行汇总分类、分析核对，自动识别可能存在潜在错报的会计分录，自动对可能存在错报的凭证进行抽查。
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
          5、重要性水平分析
        </Typography>
        <Typography variant="body2" gutterBottom>
            根据被审计单位的性质和被审计单位的财务状况及经营成果情况自动选择重要性水平计算基础和相关比率。<br/>
            提示：这里我们引进了事务所最低报表整体重要性水平的概念，即：根据指标计算出的报表整体重要性水平低于该水平时，选择事务所最低整体重要性水平。目前该金额统一设定为5万元。          </Typography>
          <Typography variant="subtitle2" gutterBottom>
          6、错报风险识别
        </Typography>
        <Typography variant="body2" gutterBottom>
            根据分析性程序、分录检查程序、供应商分析、客户分析等风险识别程序，自动识别潜在错报。
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
          7、重大账户和交易
        </Typography>
        <Typography variant="body2" gutterBottom>
            自动根据计算的重要性水平、公司的财务状况和经营成果以及识别的潜在错报自动识别重大账户和交易并判断其可能存在错报的认定。
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
          8、客户分析
        </Typography>
        <Typography variant="body2" gutterBottom>
            自动计算销售金额、收款金额、销售分录记账次数、收款分录次数、收款方式、销售和收款时间间隔、销售和收款金额差异等元素，助你快速判断可能存在潜在错报的客户。
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
          9、供应商分析
        </Typography>
        <Typography variant="body2" gutterBottom>
            自动计算采购金额、付款金额、采购分录记账次数、付款分录次数、付款方式、采购和付款时间间隔、采购和付款金额差异等元素，助你快速判断可能存在潜在错报的供应商。
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
          10、识别既是客户又是供应商的单位
        </Typography>
        <Typography variant="body2" gutterBottom>
            自动识别既是客户有是供应商的单位名称
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
          11、往来款多科目挂账
        </Typography>
        <Typography variant="body2" gutterBottom>
            自动识别既在应收账款（预付账款）核算的客户（供应商）,又同时在预收款项（应付账款）核算的客户（供应商），自动生成对冲分录。
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
          12、账龄分析功能
        </Typography>
        <Typography variant="body2" gutterBottom>
            和其他审计软件对未审数进行账龄分析不同，本系统自动对审定数进行账龄分析，不再需要人工根据调整分录逐笔调整每一笔往来的账龄。账龄分析可以精确到月份。
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
          13、标准化客户或供应商名称为营业执照全称
        </Typography>
        <Typography variant="body2" gutterBottom>
            提供供应商和客户名称标准化功能，一键变更所有年度账套中非标准的公司名称。
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
          14、工商信息自动获取、关联方自动比较分析
        </Typography>
        <Typography variant="body2" gutterBottom>
            在系统中可以一键自动获取公司、公司股东、重要客户和供应商的工商信息，按照工商信息自动检查客户和供应商是否与公司存在关联关系，以及与客户和供应商的交易记录是否与其工商信息匹配。
          </Typography>
        <Divider />
        <Typography variant="h6" gutterBottom>
          下一步拟已实现的功能：
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          1、自动打印全部底稿 <br />
          2、自动函证功能 <br />
          3、自动各科目底稿 <br />
          4、自动集团合并报表 <br />
          5、自动生成财务报表 <br />
          6、附注在线编辑 <br />
          7、自动现金流量表和底稿 <br />
          8、自动关联交易计算 <br />
          9、自动计算当期所得税 <br />
          10、自动计算信用减值损失 <br />
          11、自动计算递延所得税资产 <br />
          12、自动外币财务报表折算<br />
          13、函证平台<br />
          14、自动生成审计报告<br />
          15、自动识别行业风险<br />
          16、添加智能数据导入接口<br />
          17、在线复核流程设计<br />
          18、在线知识库<br />
          19、外币往来账龄精确计算<br />
          20、事务所后台管理系统<br />
          19、后台管理系统<br />
          。。。<br />

        </Typography>
      </TabPanel>
      <TabPanel value={value} index={2}>
        使用视频正在制作中。。。
      </TabPanel>
      <TabPanel value={value} index={3}>
        如果你有好的建议，或者对该系统有兴趣，有想法。欢迎互相讨论。<br />
        联系方式：litufu@gewu.org.cn
      </TabPanel>
      <TabPanel value={value} index={4}>
      {/* <Link to={`/main`}>格物在线审计系统入口</Link> */}
        <Login />
      </TabPanel>
    </div>
  );
}