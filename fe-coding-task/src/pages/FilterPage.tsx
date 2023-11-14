import React, { useContext, useEffect, useState } from 'react';
import 'App.css';
import { IApiResponse, getVariables, postChartData } from 'api/api';
import { useForm, SubmitHandler } from "react-hook-form"
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Button, Skeleton, TextField } from '@mui/material';
import { compareQuarters, downloadCSV, generateQuartersBetween } from 'utils/functions';
import BarChart from 'components/BarChart';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from 'react-router-dom';
import History from 'components/History/History';
import { COLORS } from 'gloabls/colors';
import { IAppContext, IStettingsState, appContext } from 'state/context';

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-width : 100vw;
  background-color: ${COLORS.lightGrey};
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
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



function FilterPage() {
  const ctx = useContext(appContext);
  
  const { register, handleSubmit } = useForm<IDataToQuery>()
  
  const [boligtypes, setBoligtypes] = useState<Boligtype[]>([{value: '', valueText: ''}]);
  const [kvartals, setKvartals] = useState<Kvartal[]>([{value: '', valueText: ''}]);

  const [boligtype, setBoligtype] = useState<string>('');
  const [kvartalFrom, setKvartalFrom] = useState<string>('');
  const [kvartalTo, setKvartalTo] = useState<string>('');
  const [comment, setComment] = useState<string>('');

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const [chartData, setChartData] = useState<number[]>([]); // make a interface for this
  const [quartersBetween, setQuartersBetween] = useState<string[]>([]);
  const [allData, setAllData] = useState<IApiResponse | null>(null);
  const [isChartVisible, setIsChartVisible] = useState<boolean>(false);
  const [isFetchingChartData, setFetchingChartData] = useState<boolean>(false);
 
  const navigate = useNavigate();

  const updateUrlAndLocalStorage= (boligtype:string, kvartalFrom: string, kvartalTo: string) => {
    navigate(`/?boligtype=${boligtype}&kvartalFrom=${kvartalFrom}&kvartalTo=${kvartalTo}`);
    localStorage.setItem('boligtype', boligtype);
    localStorage.setItem('kvartalFrom', kvartalFrom);
    localStorage.setItem('kvartalTo', kvartalTo);
    // localStorage.setItem(`comment_${boligtype}_${kvartalFrom}_${kvartalTo}`, comment);
  };

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
              setTimeout(() => {
                setFetchingChartData(false);
              }, 3000);
              // setFetchingChartData(false);
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

  const onChangeComment = (event: any) => {
    const value = event.target.value;
    setComment(value);
    localStorage.setItem(`comment_${boligtype}_${kvartalFrom}_${kvartalTo}`, value);
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
    const params = new URLSearchParams(window.location.search);
    const boligtype = params.get('boligtype');
    const kvartalFrom = params.get('kvartalFrom');
    const kvartalTo = params.get('kvartalTo');
    if (boligtype && kvartalFrom && kvartalTo) {
      setBoligtype(boligtype);
      setKvartalFrom(kvartalFrom);
      setKvartalTo(kvartalTo);
    } else if (localStorage.getItem('boligtype') && localStorage.getItem('kvartalFrom') && localStorage.getItem('kvartalTo')) {
      const boligtype = localStorage.getItem('boligtype');
      const kvartalFrom = localStorage.getItem('kvartalFrom');
      const kvartalTo = localStorage.getItem('kvartalTo');
      if (boligtype && kvartalFrom && kvartalTo) {
        setBoligtype(boligtype);
        setKvartalFrom(kvartalFrom);
        setKvartalTo(kvartalTo);
      } 
    }
  }, []);

  useEffect(() => {
    console.log('chartData',chartData);
  }, [chartData]);

  useEffect(() => {
    updateUrlAndLocalStorage(boligtype, kvartalFrom, kvartalTo);
    if (localStorage.getItem(`comment_${boligtype}_${kvartalFrom}_${kvartalTo}`)) {
      const comment = localStorage.getItem(`comment_${boligtype}_${kvartalFrom}_${kvartalTo}`);
      if (comment) {
        setComment(comment);
      }
    }  else {
      setComment('');
    }
  }, [boligtype, kvartalFrom, kvartalTo]);

  return (
    <MainWrapper>
      {ctx?.settingsState.isHistoryNavOpen ? <History />: null}
      {isLoaded ? (
        <Wrapper>
          <Box sx={{ minWidth: 400, marginBottom: 10, marginTop: 12}}>
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
              color="success" variant="contained">
                Get Data
            </LoadingButton>
          ): (
            <Button 
              sx={{width: '100%', height: '56px'}} 
              color="success" variant="contained" onClick={handleSubmit(onSubmit)}>
                Get Data
            </Button>
          )}
          </Box>
          <TextField 
              multiline
              rows={4}
              id="outlined-basic" label="Add Comment" variant="outlined" 
              sx={{width: 600, maxHeight: 200}}
              value={comment}
              onChange={onChangeComment}
            />
          { isChartVisible ?
          (<Box sx={{width: '80%', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <BarChart data={chartData} labels={quartersBetween} name={allData?.label ?? "" } 
              isFetchingChartData={isFetchingChartData} comment={comment}
            />
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

export default FilterPage;
