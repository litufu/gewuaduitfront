import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Link } from '@reach/router'
import Divider from '@material-ui/core/Divider';
import {Comment} from '../components'

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
  center:{
    textAlign:"center"
  }
}));

export default function Introduction() {
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
          <Tab label="功能介绍" {...a11yProps(1)} />
          <Tab label="使用视频" {...a11yProps(2)} />
          <Tab label="评论建议" {...a11yProps(3)} />
          <Tab label="加入我们" {...a11yProps(4)} />
          <Tab label="格物在线审计" {...a11yProps(5)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Typography variant="h5" display="inline" gutterBottom>格物在线审计系统</Typography>是一款正在开发的在线、智能化审计系统。项目目标：
        <Typography variant="subtitle2" gutterBottom>
        1、将事务所的底稿变废为宝
        </Typography>
        <Typography variant="body2" gutterBottom>
          底稿是会计师事务所最宝贵的资源，但由于纸质底稿不易于携带、不易于查询，所以纸质底稿一般会被堆放在仓库里等着发霉。如此宝贵的数据资源被白白的浪费掉。
          格物在线审计软件，在线统一标准化底稿，让你可以随时查看以前年度的底稿，并且可以在统一的数据库资源上开发利用，提升会计师事务所的行业投研能力，为事务所提供咨询业务提供有力的支撑。
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
        <Typography variant="subtitle2" gutterBottom>
        2、审计自动化、智能化
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
           。。。。详见功能介绍<br/>
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
        3、审计迈入超详细审计时代。
        </Typography>
        <Typography variant="body2" gutterBottom>
          由于审计人员数量和时间的限制，我们现在无法对所有的凭证进行检查复核。现在我们可以将会计准则变为计算机程序，然后使用计算机程序来检查每一笔凭证。由于计算机运算速度是人类检查凭证的上万倍并且可以不间断工作，因此我们可以在底层实施超详细审计。
        </Typography>
        4、底稿一处更新、处处更新
          </Typography>
          <Typography variant="body2" gutterBottom>
            以审计调整分录为基准，审计调整分录改变后，试算平衡表、报表分析性程序、重要性水平、风险评估表、凭证抽查表等相关底稿全部更新。避免人工每次调整一个数，所有底稿、报表和附注全部手动改一遍的麻烦。
          </Typography>
        <Typography variant="subtitle2" gutterBottom>
        5、大幅节省注册会计师工作时间。
        </Typography>
        <Typography variant="body2" gutterBottom>
          使内勤工作自动化、智能化，大幅减少注册会计师的工作量，让注册会计师能够享有正常人的休息时间，过正常人的生活。让事务所告别人海战术，大幅节省劳动力成本。
        </Typography>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Typography variant="h6" gutterBottom>
          已实现的主要功能
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
          <Typography variant="subtitle2" gutterBottom>
          15、函证中心功能
        </Typography>
        <Typography variant="body2" gutterBottom>
            帮助所有的事务所建立函证中心。函证中心工作流程：（1）每个事务所设立唯一的函证中心。（2）函证中心收到或发出函证后，扫描函证上的二维码自动进入函证上传页面，将函证、快递单拍照上传。(3)函证由系统自动分发到每个项目对应的函证明细表中，所有项目组成员可以及时看到所有的函证回函情况。(4)函证中心按照日期统一装订函证作为备查，无需再分发给项目组。详细帮助请查看视频。
          </Typography>
          <Typography variant="subtitle2" gutterBottom>
          16、汇率中间价获取功能
        </Typography>
        <Typography variant="body2" gutterBottom>
            在工具箱中，输入日期和币种，自动获取人民币中间价。
          </Typography>
        <Divider />
        <Typography variant="h6" gutterBottom>
          正在努力实现的功能：
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          1、自动打印全部底稿 <br />
          2、外币余额表智能导入 <br />
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
          21、格物审计后台管理系统<br />
          22、总分所质控管理<br />
          23、智能选择审计风险应对程序<br />
          24、固定资产智能导入<br />
          25、存货收发存数据智能导入<br />
          26、收入数据智能导入<br />
          27、自动固定资产折旧测算<br />
          28、自动计算成本倒扎表<br />
          29、自动存货收发存数据与账套比对<br />
          30、自动收入数据与账套比对<br />
          31、自动使用权资产和租赁负债重新计算<br />
          32、自动账务处理规范检测<br />
          33、自动识别诉讼风险<br />
          34、自动生成关键审计事项<br />
          35、为事务所建立行业数据分析系统<br />
          36、自动生成银行函证<br />
          37、自动生成投资类账户函证<br />
          38、在线对公司人员访谈自动记录<br />
          39、在线盘点存货和固定资产自动记录<br />
          40、项目组在线会议自动记录<br />
          41、企业内控缺陷自动识别<br />
          42、自动期后回款计算<br />
          43、自动生成函证统计表<br />
          44、自动生成往来替代程序表<br />
          。。。<br />

        </Typography>
      </TabPanel>
      <TabPanel value={value} index={2}>
        使用视频正在制作中。。。
      </TabPanel>
      <TabPanel value={value} index={3} className={classes.center}>
        <Comment />
      </TabPanel>
      <TabPanel value={value} index={4}>
      <Typography style={{margin:5}}>&nbsp;   &nbsp;   &nbsp;   &nbsp;   &nbsp;   如果你对在线、智能化审计系统感兴趣，认为在线、智能化审计是未来的趋势。来吧，加入我们，我们共同来打造这款系统。因为你的加入，系统将会变的更加强大。招募合伙人：</Typography>
      <Typography style={{margin:3,fontWeight:"bold"}}>1、业务类合伙人</Typography>
      <Typography style={{margin:3,}}>招募人数：若干</Typography>
      <Typography style={{margin:3,}}>截止日期：2019-12-31</Typography>
      <Typography>职位描述</Typography>
      <Typography>(1)提出审计自动化需求，并细化需求的各个步骤和流程，可以简要的手绘审计业务流程图。</Typography>
      <Typography>(2)与IT合伙人沟通业务需求。</Typography>
      <Typography>(3)负责测试IT程序是否符合需求，提出改进意见。</Typography>
      <Typography>任职要求</Typography>
      <Typography>(1)熟悉审计业务工作流程。</Typography>
      <Typography>(2)熟悉常见的审计风险和会计错报。</Typography>
      <Typography>(3)参与过上市公司、ipo、国有企业、私营企业等不同类型的审计业务。</Typography>
      <Typography>(4)接触过多种行业，接触过多个财务软件，熟悉常见的会计处理。</Typography>
      <Typography>(5)熟悉Excel的使用，有任何编程经验更佳。</Typography>
      <Typography>(6)全职兼职均可。</Typography>
      <Typography style={{margin:3,fontWeight:"bold"}}>2、IT合伙人</Typography>
      <Typography style={{margin:3,}}>招募人数：若干</Typography>
      <Typography style={{margin:3,}}>截止日期：2019-12-31</Typography>
      <Typography>职位描述</Typography>
      <Typography>(1)汇总业务合伙人的各个需求。制定合理的技术实现方案。</Typography>
      <Typography>(2)负责IT部门人员的招聘、指导培训和绩效考核</Typography>
      <Typography>(3)负责制定项目实施计划，并按照计划的实施项目。</Typography>
      <Typography>(4)负责代码的测试、运行、维护和升级工作。</Typography>
      <Typography>任职要求</Typography>
      <Typography>(1)作为项目经理，成功承担并完成实施2个以上项目。</Typography>
      <Typography>(2)前端了解React,ES6,apollo-client为佳</Typography>
      <Typography>(3)后端了解nodejs,apollo-server,prisma为佳。</Typography>
      <Typography>(4)熟悉python编程中的pandas,numpy等数据处理工具和简单爬虫实现。</Typography>
      <Typography>(5)对docker,git ,linux，bash等常用命令有所了解。</Typography>
      <Typography>(6)全职。</Typography>
      <Typography style={{margin:3,fontWeight:"bold"}}>备注：合伙协议、合伙人出资收益分成、办公地点选定、日常监督管理规范等在筹建合伙人大会时讨论决定。</Typography>
      <Typography>组织人：李老师</Typography>
      <Typography>组织人邮箱：litufu@gewu.org.cn</Typography>
      </TabPanel>
      <TabPanel value={value} index={5}>
      <Link to="/main">格物在线审计系统</Link>
        {/* <Login /> */}
      </TabPanel>
    </div>
  );
}