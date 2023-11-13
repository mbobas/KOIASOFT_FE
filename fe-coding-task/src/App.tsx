import React, { useEffect, useState } from 'react';
import './App.css';
import { IApiResponse, getVariables, postChartData } from 'api/api';
import { useForm, SubmitHandler } from "react-hook-form"
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Button, Input, Skeleton, Stack } from '@mui/material';
import { COLORS } from 'gloabls/colors';
import { compareQuarters, generateQuartersBetween } from 'utils/functions';
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import BarChart from 'components/BarChart';
import LoadingButton from '@mui/lab/LoadingButton';

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width : 100vw;
  margin-bottom: 100px;
`

const StyledInputLabel = styled(InputLabel)`
  margin-bottom: 100px;
  width: 100%;
`;

const Message = styled.p`
  color: red;
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface Boligtype {
  value: string;
  valueText: string;
}

interface Kvartal {
  value: string;
  valueText: string;
}

interface IDataToQuery {
  boligtype: Array<Boligtype>;
  kvartalFrom: Array<Kvartal>;
  kvartalTo: Array<Kvartal>;
}

function App() {
  const { register, handleSubmit } = useForm<IDataToQuery>()
  
  const [boligtypes, setBoligtypes] = useState<Boligtype[]>([{value: '', valueText: ''}]);
  const [kvartals, setKvartals] = useState<Kvartal[]>([{value: '', valueText: ''}]);

  const [boligtype, setBoligtype] = useState<string>('');
  const [kvartalFrom, setKvartalFrom] = useState<string>('');
  const [kvartalTo, setKvartalTo] = useState<string>('');

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const [chartData, setChartData] = useState<number[]>([]); // make a interface for this
  const [quartersBetween, setQuartersBetween] = useState<string[]>([]);
  const [allData, setAllData] = useState<IApiResponse | null>(null);
  const [isChartVisible, setIsChartVisible] = useState<boolean>(false);
  const [isFetchingChartData, setFetchingChartData] = useState<boolean>(false);


  const onSubmit: SubmitHandler<IDataToQuery> = (data) => {
    setFetchingChartData(true);
    if (!boligtype || !kvartalFrom || !kvartalTo) {
      setMessage('Please fill all fields');
      setFetchingChartData(false);
      return;
    }
    const isValidKvartals = compareQuarters(kvartalFrom, kvartalTo)
    if (isValidKvartals) {
      setMessage('');
      const fetchChartData = async (boligtype: string, quarters:string[]) => {
        const chartData = await postChartData(boligtype, quarters);
          if (chartData) {
            setAllData(chartData)
            setChartData(chartData.value);
            setQuartersBetween(quarters);
            setIsChartVisible(true);
            setFetchingChartData(false);
          }
      }
      const quarters = generateQuartersBetween(kvartalFrom, kvartalTo);
      fetchChartData(boligtype, quarters);
    } else {
      setMessage('KvartalFrom must be smaller than KvartalTo or equal');
      setFetchingChartData(false);
    }
  }
  
  const onChangeSelect = () => {
    setAllData(null);
    setChartData([]);
    setQuartersBetween([]);
    setIsChartVisible(false);
  }

  const handleChangeBoligtype = (event: any) => {
    const value = event.target.value;
    setBoligtype(value);
    onChangeSelect();
  }

  const handleChangeKvartalFrom = (event: any) => {
    const value = event.target.value;
    setKvartalFrom(value);
    onChangeSelect();
  }

  const handleChangeKvartalTo = (event: any) => {
    const value = event.target.value;
    setKvartalTo(value);
    onChangeSelect();
  }

  useEffect(() => {
    const fetchVariables = async () => {
      const data = await getVariables();
      if (data) {
        setBoligtypes(data.boligtype);
        setKvartals(data.kvartal);
        setTimeout(() => {
          setIsLoaded(true);
        }, 2000);
      }
    }
    fetchVariables();
  }, []);

  useEffect(() => {
    console.log('chartData',chartData);
  }, [chartData]);


  return (
    <MainWrapper>
    {isLoaded ? (
      <Wrapper>
        <Box sx={{ minWidth: 400, marginBottom: 10}}>
          <FormControl fullWidth>
            <StyledInputLabel id="input-boligtype-label">Boligtype</StyledInputLabel>
            <Select
              sx={{ marginBottom: 4}}
              {...register("boligtype")}
              labelId='input-boligtype-label'
              id="demo-simple-select"
              value={boligtype}
              label="Boligtype"
              onChange={handleChangeBoligtype}
            >
              {boligtypes.map((boligtype: Boligtype) => (
                <MenuItem key={boligtype.value} value={boligtype.value}>
                  {boligtype.valueText}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <StyledInputLabel id="input-kvartalFrom-label">KvartalFrom</StyledInputLabel>
            <Select
              sx={{ marginBottom: 4}}
              {...register("kvartalFrom")}
              labelId='input-kvartalFrom-label'
              id="input-kvartalFrom"
              value={kvartalFrom}
              label="Kvartal From"
              onChange={handleChangeKvartalFrom}
            >
              {kvartals.map((kvartal: Kvartal) => (
                <MenuItem key={kvartal.value} value={kvartal.value}>
                  {kvartal.valueText}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <StyledInputLabel id="input-kvartalTo-label">KvartalTo</StyledInputLabel>
            <Select
              sx={{ marginBottom: 4}}
              {...register("kvartalTo")}
              labelId='input-kvartalTo-label'
              id="input-kvartalTo"
              value={kvartalTo}
              label="Kvartal To"
              onChange={handleChangeKvartalTo}
            >
              {kvartals.map((kvartal: Kvartal) => (
                <MenuItem key={kvartal.value} value={kvartal.value}>
                  {kvartal.valueText}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {message && <Message>{message}</Message>}
         { isFetchingChartData ? (
          <LoadingButton loading 
            sx={{width: '100%', height: '56px'}} 
            color="success" variant="outlined">
              Get Data
          </LoadingButton>
         ): (
          <Button 
            sx={{width: '100%', height: '56px'}} 
            color="success" variant="outlined" onClick={handleSubmit(onSubmit)}>
              Get Data
          </Button>
         )}
        </Box>
        { isChartVisible ?
        (<Box sx={{width: '80%', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <BarChart data={chartData} labels={quartersBetween} name={allData?.label ?? "" }/>
        </Box>)
        : (null)
        }
      </Wrapper>
    ) : 
    (
      <Wrapper>
        <Box sx={{width: 400, display: 'felx', justifyContent: 'center', alignItems: 'center'}}>
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
        <Skeleton variant="rectangular" width={400} height={60} />
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
        <Skeleton variant="rectangular" width={400} height={60} />
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
        <Skeleton variant="rectangular" width={400} height={60} />
        <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
        <Skeleton variant="rectangular" width={400} height={60} />
      </Box>
      </Wrapper>
    )}
    </MainWrapper> 
  )
}

export default App;
