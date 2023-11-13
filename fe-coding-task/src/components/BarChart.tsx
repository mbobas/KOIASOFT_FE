import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import styled from '@emotion/styled';

interface BarChartProps {
  data: number[];
  labels: Array<string>;
  name: string;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const Title = styled.h3`
  margin-top: 200px;
`;

const BarChart = ({data, labels, name}: BarChartProps) => {
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

  return (
    <Wrapper>
      <Title>{name}</Title>
      <Bar data={dataModel} options={options} />
    </Wrapper>
  );
};

export default BarChart;
