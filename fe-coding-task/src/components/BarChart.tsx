import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import styled from '@emotion/styled';
import { Box, Button, ButtonGroup, Skeleton } from '@mui/material';
import { downloadCSV } from 'utils/functions';

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

const BarChart = ({data, labels, name, isFetchingChartData, comment}: BarChartProps) => {
  const [dataToDownload, setDataToDownload] = useState<DatatoDownload[] | null>(null);
  
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
      <Button 
          sx={{width: 250, height: '56px'}} 
          color="error" variant="outlined" onClick={() => downloadCSV(dataToDownload)}>
            Download Chart Data *.csv
      </Button>
      <Button 
          sx={{width: 250, height: '56px'}} 
          color="error" variant="outlined" onClick={() => downloadCSV(dataToDownload)}>
            Save data in history
      </Button>
    </Box>
      <Title>{name}</Title>
      <Bar data={dataModel} options={options} />
  </Wrapper>
   )}
   </>
  );
};

export default BarChart;
