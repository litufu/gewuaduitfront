import React,{Fragment} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import SelectAccountingFirm from './select-accountingfirm';
import UpdatePassword from './update-password';
import { Header } from '../../components'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      <Box >{children}</Box>
    </Box>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 300,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function VerticalTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <Fragment>
      <Header />
      <Typography variant="h6"  gutterBottom>
        账户设置
      </Typography>
      <div className={classes.root}>
        
        <Tabs
          orientation="vertical"
          variant="standard"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          className={classes.tabs}
        >
          <Tab label="选择会计师事务所" {...a11yProps(0)} />
          <Tab label="修改密码" {...a11yProps(1)} />
       
        </Tabs>
        <TabPanel value={value} index={0}>
          <SelectAccountingFirm />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <UpdatePassword />
        </TabPanel>
      </div>
    </Fragment>
  );
}