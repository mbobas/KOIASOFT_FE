import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { COLORS } from 'gloabls/colors';
import styled from '@emotion/styled';
import { Card } from '@mui/material';
import HistoryCard from './HistoryCard';
import { ReactComponent as CloseButton } from 'assets/svg/closeButton.svg';
import { useContext, useEffect } from 'react';
import { IAppContext, IHistoryList, appContext } from 'state/context';
import { set } from 'react-hook-form';

const Wrapper = styled.div`
    position: fixed;
    right: 0;
    top: 0;
    width: 300px;
    height: 100vh;
    z-index: 5;
    background-color: ${COLORS.green};
    opacity: 0.9;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    shadow: 11 11 10px rgba(0, 0, 0, 0.5);
    margin-top: 55px;
    overflow-y: scroll;
`
const Title = styled.h3`
  margin-top: 50px;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-top: 50px;
  width: 100%;
  margin-top: 50px;
`;


export default function History() {
  const ctx = useContext(appContext)
  const [hList, setHList] = React.useState<IHistoryList[]>([])

  useEffect(() => {
    const localHistory = localStorage.getItem('history');
    ctx?.setAppState((prev: IAppContext) => ({
      ...prev,
      historyList: localHistory ? JSON.parse(localHistory) : []
    }))
  }, [])

  useEffect(() => {
    if (ctx?.appState.historyList.length === 0)
      setHList(ctx?.appState.historyList)
  }, [ctx?.appState.historyList])

  return (
    <Wrapper>
      <HistoryList>
        {ctx?.appState.historyList.reverse().map((item: IHistoryList) => (
          <HistoryCard key={item.id} item={item} />
        ))}
      </HistoryList>
    </Wrapper>
  );
}