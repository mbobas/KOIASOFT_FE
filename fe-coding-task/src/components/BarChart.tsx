import React, { useContext, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import styled from '@emotion/styled';
import { Box, Button, ButtonGroup, Skeleton } from '@mui/material';
import { downloadCSV } from 'utils/functions';
import { appContext } from 'state/context';
import { COLORS } from 'gloabls/colors';
import { LoadingButton } from '@mui/lab';
import { set } from 'react-hook-form';

interface BarChartProps {
  data: number[];
  labels: Array<string>;
  name: string;
  isFetchingChartData: boolean;
  comment: string;
}

interface DatatoDownload {
  value: string;
  quarter: string;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 800px;
  height: 400px;
  margin-top: 300px;
  margin-bottom: 200px;
`
const Title = styled.h3`
`;

const StyledSpan = styled.span`
  color: ${COLORS.red};
  font-size: 14px;
  margin-top: 5px;
`;

const BarChart = ({data, labels, name, isFetchingChartData, comment}: BarChartProps) => {
  const [dataToDownload, setDataToDownload] = useState<DatatoDownload[] | null>(null);
  const ctx = useContext(appContext);
  const boligtype = ctx?.appState.boligtype;
  const kvartalFrom = ctx?.appState.kvartalFrom;
  const kvartalTo = ctx?.appState.kvartalTo;
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savingMessage, setSavingMessage] = useState<string>('Add data to history');

  const onSaveData = () => {
    setIsSaving(true);
    const localHistory = localStorage.getItem('history');
    const historyRow = {
      id: `comment_${boligtype}_${kvartalFrom}_${kvartalTo}`,
      boligtype: boligtype,
      kvartalFrom: kvartalFrom,
      kvartalTo: kvartalTo,
      comment: comment,
    }
  
    if (localHistory) {
      const parsedLocalHistory = JSON.parse(localHistory);
      const existingIndex = parsedLocalHistory.findIndex((h: any) => h.id === historyRow.id);
      
      if (existingIndex !== -1) {
        parsedLocalHistory[existingIndex] = historyRow;
        setSavingMessage('Data updated');

      } else {
        parsedLocalHistory.push(historyRow);
        setSavingMessage('Data saved');
      }

      localStorage.setItem('history', JSON.stringify(parsedLocalHistory));
      ctx?.setAppState({...ctx.appState, historyList: parsedLocalHistory});
      setIsSaving(false);
    } else {
      localStorage.setItem('history', JSON.stringify([historyRow]));
      ctx?.setAppState({...ctx.appState, historyList: [historyRow]});
      setIsSaving(false);
    }
    ctx?.setSettingsState((prev: any) => ({...prev, isHistoryNavOpen: true}));
    setTimeout(() => {
      setSavingMessage('Add data to history');
    }, 2000);
  }
  
  const dataModel = {
    labels: labels,
    datasets: [
      {
        label: "",
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false, 
      },
    }
  };


  useEffect(() => {
    const dataToDownload = data.map((value, index) => {
      return {
        value: value.toString(),
        quarter: labels[index]
      }
    })
    setDataToDownload(dataToDownload);
  }, [data, labels])

  return (
   <>
   {isFetchingChartData ? (
    <Wrapper>
      <Skeleton variant="rectangular" width={800} height={400} />
    </Wrapper>
   ) : (
    <Wrapper>
    <Box sx={{marginTop: 4, height: 100, width: 600, display: "flex", justifyContent: "space-between" }}>
      <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <Button 
          sx={{width: 250, height: '56px'}} 
          color="success" variant="outlined" onClick={() => downloadCSV(dataToDownload)}>
            Download Chart *.csv
      </Button>
      </Box>
      <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        {isSaving ? (
          <LoadingButton loading 
            sx={{width: '100%', height: '56px'}} 
            color="success" variant="contained">
              Get Data
          </LoadingButton>
        ): (
          <>
            <Button 
              sx={{width: 250, height: '56px'}} 
              color="success" variant="outlined" onClick={onSaveData}>
                {savingMessage}
            </Button>
           </>
        )}
      </Box>
    </Box>
      <Title>{name}</Title>
      <Bar data={dataModel} options={options} />
  </Wrapper>
   )}
   </>
  );
};

export default BarChart;
