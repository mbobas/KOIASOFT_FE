import React, { useContext, useEffect, useState } from 'react';
import 'App.css';
import { getVariables, postChartData } from 'api/api';
import { useForm, SubmitHandler } from "react-hook-form"
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Button, TextField } from '@mui/material';
import { compareQuarters, generateQuartersBetween } from 'utils/functions';
import BarChart from 'components/BarChart/BarChart';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from 'react-router-dom';
import History from 'components/History/History';
import { COLORS } from 'gloabls/colors';
import { IAppContext, IStettingsState, appContext } from 'state/context';
import { Boligtype, IApiResponse, IDataToQuery, Kvartal } from 'state/interfaces';
import FilterSkeleton from 'pages/FilterPage/FilterSkeleton';

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


function FilterPage() {
  const ctx = useContext(appContext);
  const boligtype = ctx?.appState.boligtype;
  const kvartalFrom = ctx?.appState.kvartalFrom;
  const kvartalTo = ctx?.appState.kvartalTo;
  const comment = ctx?.appState.comment;

  const { register, handleSubmit } = useForm<IDataToQuery>()
  const getDataRef = React.useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const [boligtypes, setBoligtypes] = useState<Boligtype[]>([{ value: '', valueText: '' }]);
  const [kvartals, setKvartals] = useState<Kvartal[]>([{ value: '', valueText: '' }]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [chartData, setChartData] = useState<number[]>([]);
  const [quartersBetween, setQuartersBetween] = useState<string[]>([]);
  const [allData, setAllData] = useState<IApiResponse | null>(null);
  const [isChartVisible, setIsChartVisible] = useState<boolean>(false);
  const [isFetchingChartData, setFetchingChartData] = useState<boolean>(false);

  const updateUrlAndLocalStorage = (boligtype: string, kvartalFrom: string, kvartalTo: string, comment: string) => {
    navigate(`/?boligtype=${boligtype}&kvartalFrom=${kvartalFrom}&kvartalTo=${kvartalTo}&comment=${comment}`);
    localStorage.setItem('boligtype', boligtype);
    localStorage.setItem('kvartalFrom', kvartalFrom);
    localStorage.setItem('kvartalTo', kvartalTo);
  };

  const onSubmit: SubmitHandler<IDataToQuery> = () => {
    setFetchingChartData(true);
    if (!boligtype || !kvartalFrom || !kvartalTo) {
      setMessage('Please fill all fields');
      setFetchingChartData(false);
      return;
    }
    const isValidKvartals = compareQuarters(kvartalFrom, kvartalTo)
    if (isValidKvartals) {
      setMessage('');
      const fetchChartData = async (boligtype: string, quarters: string[]) => {
        const chartData = await postChartData(boligtype, quarters);
        if (chartData) {
          setAllData(chartData)
          setChartData(chartData.value);
          setQuartersBetween(quarters);
          setIsChartVisible(true);
          setTimeout(() => {
            setFetchingChartData(false);
          }, 3000);
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
    setMessage('');
  }

  const handleChangeBoligtype = (event: any) => {
    const value = event.target.value;
    ctx?.setAppState({ ...ctx.appState, boligtype: value });
    onChangeSelect();
  }

  const handleChangeKvartalFrom = (event: any) => {
    const value = event.target.value;
    ctx?.setAppState({ ...ctx.appState, kvartalFrom: value });
    onChangeSelect();
  }

  const handleChangeKvartalTo = (event: any) => {
    const value = event.target.value;
    ctx?.setAppState({ ...ctx.appState, kvartalTo: value });
    onChangeSelect();
  }

  const onChangeComment = (event: any) => {
    const value = event.target.value;
    ctx?.setAppState({ ...ctx.appState, comment: value });
    localStorage.setItem(`comment_${boligtype}_${kvartalFrom}_${kvartalTo}`, value);
    const localHistory = localStorage.getItem('history');
    const historyList = localHistory ? JSON.parse(localHistory) : [];
    const existingIndex = historyList.findIndex((h: any) => h.id === `comment_${boligtype}_${kvartalFrom}_${kvartalTo}`);
    if (existingIndex !== -1) {
      historyList[existingIndex].comment = value;
      localStorage.setItem('history', JSON.stringify(historyList));
      ctx?.setAppState({ ...ctx.appState, historyList: historyList, comment: value });
    }
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
    const localHisotryIsEmpty = localStorage.getItem('history');
    if (!localHisotryIsEmpty) {
      const exampleItem = {
        "id": "comment_03_2009K1_2011K1",
        "boligtype": "03",
        "kvartalFrom": "2009K1",
        "kvartalTo": "2011K1",
        "comment": "Hello, Here you can add or edit your comment"
      }
      ctx?.setAppState((prev: IAppContext) => ({ ...prev, historyList: [exampleItem] }));
      localStorage.setItem('history', JSON.stringify([exampleItem]));
    }
    fetchVariables();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    ctx?.setAppState((prev: IAppContext) => ({ ...prev, boligtypeList: boligtypes }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boligtypes]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const boligtype = params.get('boligtype');
    const kvartalFrom = params.get('kvartalFrom');
    const kvartalTo = params.get('kvartalTo');
    const comment = params.get('comment');
    const run = params.get('run');
    if (boligtype && kvartalFrom && kvartalTo) {
      ctx?.setAppState({ ...ctx.appState, boligtype: boligtype, kvartalFrom: kvartalFrom, kvartalTo: kvartalTo, comment: comment });
      if (run === 'true') {
        setTimeout(() => {
          getDataRef.current?.click();
        }, 3000);
      }
    } else if (localStorage.getItem('boligtype') && localStorage.getItem('kvartalFrom') && localStorage.getItem('kvartalTo')) {
      const boligtype = localStorage.getItem('boligtype');
      const kvartalFrom = localStorage.getItem('kvartalFrom');
      const kvartalTo = localStorage.getItem('kvartalTo');
      const comment = localStorage.getItem(`comment_${boligtype}_${kvartalFrom}_${kvartalTo}`);
      if (boligtype && kvartalFrom && kvartalTo) {
        ctx?.setAppState({ ...ctx.appState, boligtype: boligtype, kvartalFrom: kvartalFrom, kvartalTo: kvartalTo, comment: comment });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateUrlAndLocalStorage(boligtype ?? '', kvartalFrom ?? '', kvartalTo ?? '', comment ?? '');
    if (boligtype && kvartalFrom && kvartalTo) {
      const localCom = localStorage.getItem(`comment_${boligtype}_${kvartalFrom}_${kvartalTo}`);
      const params = new URLSearchParams(window.location.search);
      const externalCom = params.get('comment');
      if (localCom && externalCom && (localCom !== externalCom)) {
        ctx?.setAppState((prev: IAppContext) => ({ ...prev, comment: "***You LocalStorageComment\n" + localCom + "\n***Comment from external url:\n" + externalCom }));
      } else if (localCom) {
        ctx?.setAppState((prev: IAppContext) => ({ ...prev, comment: localCom }));
      } else if (externalCom) {
        ctx?.setAppState((prev: IAppContext) => ({ ...prev, comment: externalCom }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boligtype, kvartalFrom, kvartalTo]);

  useEffect(() => {
    if (ctx?.settingsState.isHistoryItemClicked) {
      getDataRef.current?.click();
      ctx?.setSettingsState((prev: IStettingsState) => ({ ...prev, isHistoryItemClicked: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx?.settingsState.isHistoryItemClicked]);


  return (
    <MainWrapper>
      {ctx?.settingsState.isHistoryNavOpen ? <History /> : null}
      {isLoaded ? (
        <Wrapper>
          <Box sx={{ width: 400, marginBottom: 10, marginTop: 12 }}>
            <FormControl fullWidth>
              <StyledInputLabel id="input-boligtype-label">Boligtype</StyledInputLabel>
              <Select
                sx={{ marginBottom: 4 }}
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
                sx={{ marginBottom: 4 }}
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
                sx={{ marginBottom: 4 }}
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
            {isFetchingChartData ? (
              <LoadingButton loading
                sx={{ width: '100%', height: '56px' }}
                color="success" variant="contained">
                Get Data
              </LoadingButton>
            ) : (
              <Button
                ref={getDataRef}
                sx={{ width: '100%', height: '56px' }}
                color="success" variant="contained" onClick={handleSubmit(onSubmit)}>
                Get Data
              </Button>
            )}
          </Box>
          <TextField
            multiline
            rows={4}
            id="outlined-basic" label="Add Comment" variant="outlined"
            sx={{ width: 600, maxHeight: 200 }}
            value={comment}
            onChange={onChangeComment}
          />
          {isChartVisible ?
            (<Box sx={{ width: '80%', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <BarChart data={chartData} labels={quartersBetween} name={allData?.label ?? ""}
                isFetchingChartData={isFetchingChartData} comment={comment ?? ''}
              />
            </Box>)
            : (null)
          }
        </Wrapper>
      ) :
        (
          <FilterSkeleton />
        )}
    </MainWrapper>
  )
}

export default FilterPage;
