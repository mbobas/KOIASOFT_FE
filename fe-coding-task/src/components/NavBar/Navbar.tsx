import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { COLORS } from 'gloabls/colors';
import { appContext } from 'state/context';
import { useContext, useEffect, useState } from 'react';
import { Skeleton } from '@mui/material';

export default function NavBar() {
  const ctx = useContext(appContext);
  const [isNavLoading, setIsNavLoading] = useState<boolean>(false)

  useEffect(() => {
    setIsNavLoading(true)
    setTimeout(() => {
      setIsNavLoading(false)
    }, 2000)
  }
    , [])

  const onClickHistoryMenu = () => {
    ctx?.setSettingsState((prevState: any) => ({
      ...prevState,
      isHistoryNavOpen: prevState.isHistoryNavOpen ? false : true
    }));
  }

  return (
    <>
      {isNavLoading ? (
        <Box sx={{ flexGrow: 1, zIndex: 11 }}>
          <Skeleton sx={{ width: '100%' }} variant="rectangular" height={60} />
        </Box>
      )
        : (
          <Box sx={{ flexGrow: 1, zIndex: 11 }}>
            <AppBar position="static" sx={{ zIndex: 11, position: "fixed", backgroundColor: COLORS.green }}>
              <Toolbar sx={{ display: "flex", justifyContent: 'flex-end' }}>
                <Typography variant="h6" component="div">
                  History
                  <IconButton
                    size="large"
                    edge="end"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                  >
                    <MenuIcon onClick={onClickHistoryMenu} />
                  </IconButton>
                </Typography>
              </Toolbar>
            </AppBar>
          </Box>
        )}
    </>
  );
}