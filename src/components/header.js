import React from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { navigate } from "@reach/router"
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar, { styles as toolbarStyles } from './Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Home from './home'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  homeButton: {
    marginRight: theme.spacing(2),
  },
  placeholder: toolbarStyles(theme).root,
  title: {
    flexGrow: 1,
  },
}));

export default function MenuAppBar() {
  const classes = useStyles();
  const client = useApolloClient();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorEl2);

  function handleMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMenu2(event) {
    setAnchorEl2(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleClose2() {
    setAnchorEl2(null);
  }

  return (
    <div >
      <AppBar position="fixed" >
        <Toolbar>
          <Home />
          <Typography variant="h6" className={classes.title}>
            格物审计
          </Typography>
          <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu2}
                color="inherit"
              >
                <AddIcon />
              </IconButton>
              <Menu
                id="menu-appbar1"
                anchorEl={anchorEl2}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open2}
                onClose={handleClose2}
              >
                <MenuItem onClick={()=>navigate('createcustomer')}>新增客户</MenuItem>
                <MenuItem onClick={()=>navigate('uploaddata')}>上传数据</MenuItem>
                <MenuItem onClick={() => navigate('createproject')}>创建项目</MenuItem>
                <MenuItem onClick={() => navigate('createproject')}>创建集团项目</MenuItem>
              </Menu>
            </div>
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={()=>navigate('profile')}>个人信息</MenuItem>
                <MenuItem onClick={()=>navigate('settings')}>账户设置</MenuItem>
                <MenuItem onClick={()=>navigate('accountingfirm')}>单位信息</MenuItem>
                <MenuItem onClick={() => {
                    // client.writeData({ data: { 
                    //   isLoggedIn: false,
                    //   emailvalidated:false
                    //  } });

                    localStorage.clear();
                    client.resetStore()
                    navigate("/")
                }}>退出登录</MenuItem>
              </Menu>
            </div>
        </Toolbar>
      </AppBar>
      <div className={classes.placeholder} />
    </div>
  );
}