import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import chart from 'assets/img/chart.jpeg';
import { IHistoryList, appContext } from 'state/context';
import { Boligtype } from 'pages/FilterPage';
import { useEffect } from 'react';



interface IHistoryCardProps {
    item: IHistoryList
}

export default function HistoryCard({item}: IHistoryCardProps) {
    const {boligtype, kvartalFrom, kvartalTo, comment} = item;
    const ctx = React.useContext(appContext)
    const [boligTypeName, setBoligTypeName] = React.useState<string>('')

    useEffect(() => {
        const bname = ctx?.settingsState?.boligtypeList?.find((item: Boligtype ) => item.value === boligtype)?.name;
        if (bname) {
            setBoligTypeName(bname)
        }
    }, [])

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
        <Button size="small">Edit</Button>
        <Button size="small">Share</Button>
      </CardActions>
    </Card>
  );
}