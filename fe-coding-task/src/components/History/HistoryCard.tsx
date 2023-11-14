import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import chart from 'assets/img/chart.jpeg';

export default function HistoryCard() {
  return (
    <Card sx={{ width: "80%", marginBottom: 2 }}>
      <CardMedia
        sx={{ height: 80 }}
        image={chart}
        title="charts"
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          2010K1 - 2021K2 - Boligtype
        </Typography>
        <Typography variant="body2" color="text.secondary">
            Comment Comment Comment
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Edit</Button>
        <Button size="small">Share</Button>
      </CardActions>
    </Card>
  );
}