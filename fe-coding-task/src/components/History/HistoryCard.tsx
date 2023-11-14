import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import chart from 'assets/img/chart.jpeg';
import { IAppContext, IStettingsState, appContext } from 'state/context';
import { useEffect } from 'react';
import { set } from 'react-hook-form';
import { Boligtype, IHistoryList } from 'state/interfaces';

interface IHistoryCardProps {
    item: IHistoryList
}

export default function HistoryCard({item}: IHistoryCardProps) {
    const {boligtype, kvartalFrom, kvartalTo, comment, id} = item;
    const ctx = React.useContext(appContext)
    const [boligTypeName, setBoligTypeName] = React.useState<any>('')

    const onClickEdit = () => {
        ctx?.setAppState((prev: IAppContext) => ({
            ...prev,
            boligtype: boligtype,
            kvartalFrom: kvartalFrom,
            kvartalTo: kvartalTo,
            comment: comment
        }))
        ctx?.setSettingsState((prev: IStettingsState) => ({
            ...prev,
            isHistoryItemClicked: true
        }))
    }

    const onRemoveItem = () => {
        const localHistory = localStorage.getItem('history');
        console.log('localHistory', localHistory)
        const historyList = localHistory ? JSON.parse(localHistory) : [];
        console.log('historyList', historyList)
        const newHistoryList = historyList.filter((item: IHistoryList) => item.id !== id)
        console.log('newHistoryList', newHistoryList)
        localStorage.setItem('history', JSON.stringify(newHistoryList))
        ctx?.setAppState((prev: IAppContext) => ({
            ...prev,
            historyList: newHistoryList
        }))
    }

    const onShareLink = () => {
          const baseUrl = window.location.origin
          const url = `${baseUrl}/?boligtype=${boligtype}&kvartalFrom=${kvartalFrom}&kvartalTo=${kvartalTo}&comment=${comment}&run=true`
          navigator.clipboard.writeText(url)

        }

    useEffect(() => {
      if (!ctx?.appState.boligtypeList) return;
      const bname: Boligtype[] | undefined = ctx?.appState?.boligtypeList
        .filter((item: Boligtype) => item.value === boligtype)
      
      setBoligTypeName(bname[0].valueText)
    }, [ctx?.appState.boligtypeList])

  return (
    <Card sx={{ width: "80%", marginBottom: 2 }}>
      <CardMedia
        sx={{ height: 80 }}
        image={chart}
        title="charts"
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {kvartalFrom} - {kvartalTo} - {boligTypeName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
            {comment}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={onClickEdit} size="small">Edit</Button>
        <Button onClick={onShareLink} size="small">Share</Button>
        <Button onClick={onRemoveItem} size="small">Delete</Button>
      </CardActions>
    </Card>
  );
}