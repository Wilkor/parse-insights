import React, { useEffect, useState } from 'react';
import metaApi from '../services/metaApi';
import { Insight } from '../models/Insight';
import { Grid, Box, Typography, Tooltip, Card, TextField, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface InsightsChartProps {
  campaignId: string;
  pageAccessToken: string | null;
}

const InsightsChart: React.FC<InsightsChartProps> = ({ campaignId, pageAccessToken }) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<string>('');

  useEffect(() => {
    if (startDate && endDate && pageAccessToken) {
      const fetchInsights = async () => {
        try {
          const data = await metaApi.getInsights(campaignId, startDate, endDate, pageAccessToken);
          setInsights(data);
        } catch (error) {
          console.error('Error fetching insights:', error);
        }
      };
      fetchInsights();
    }
  }, [campaignId, startDate, endDate, pageAccessToken]);

  const insight = insights[0] || {};

  // Data for bar charts
  const barData1 = [
    { name: 'Impressions', value: insight.impressions || 0 },
    { name: 'Reach', value: insight.reach || 0 }
  ];

  const barData2 = [
    { name: 'Clicks', value: insight.clicks || 0 },
    { name: 'Unique Clicks', value: insight.unique_clicks || 0 }
  ];

  const handleOpenModal = async () => {
    if (!pageAccessToken) {
      setAnalysis('Page access token is missing.');
      setOpenModal(true);
      return;
    }

    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY; // Utilize variáveis de ambiente para armazenar chaves de API
      const url = 'https://api.openai.com/v1/completions';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo-instruct',
          prompt: `Analise o seguinte payload e forneça uma análise qualitativa:\n\n${JSON.stringify(insights)}`,
          max_tokens: 150
        })
      });

      const result = await response.json();
      setAnalysis(result.choices[0].text); 
    } catch (error) {
      console.error('Error fetching analysis:', error);
      setAnalysis('Failed to fetch analysis.');
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Insights Chart</Typography>
      <Paper elevation={3} style={{ padding: '16px', marginBottom: '20px' }}>
        <TextField
          id="start-date"
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          style={{ marginRight: '16px' }}
        />
        <TextField
          id="end-date"
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        {endDate && <Button
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: '16px' }}
          onClick={handleOpenModal}
        >
          Analisar com I.A
        </Button>}
      </Paper>

      {endDate && (
        <>
          {/* Cards Section */}
          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            {[
              { label: 'Impressions', value: insight.impressions, tooltip: 'Total number of impressions received' },
              { label: 'Reach', value: insight.reach, tooltip: 'Total reach of the campaign' },
              { label: 'Spend', value: `$${insight.spend}`, tooltip: 'Total amount spent' },
              { label: 'Clicks', value: insight.clicks, tooltip: 'Total number of clicks' },
              { label: 'Unique Clicks', value: insight.unique_clicks, tooltip: 'Total number of unique clicks' },
              { label: 'Frequency', value: insight.frequency, tooltip: 'Average frequency of ad exposure' }
            ].map((item, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Tooltip title={item.tooltip} arrow>
                  <Card sx={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: 3, p: 2, textAlign: 'center' }}>
                    <Box>
                      <Typography variant="h5" sx={{ color: '#333', mb: 1 }}>
                        {item.value || 'N/A'}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ color: '#666' }}>
                        {item.label}
                      </Typography>
                    </Box>
                  </Card>
                </Tooltip>
              </Grid>
            ))}
          </Grid>

          {/* Bar Charts Section */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>Impressions vs. Reach</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <BarChart width={500} height={300} data={barData1}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom>Clicks vs. Unique Clicks</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <BarChart width={500} height={300} data={barData2}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </Box>
            </Grid>
          </Grid>

          {/* Modal for Analysis */}
          <Dialog open={openModal} onClose={handleCloseModal} fullWidth>
            <DialogTitle>Análise com I.A</DialogTitle>
            <DialogContent>
              <Typography variant="body1">{analysis || 'Carregando análise...'}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} color="primary">
                Fechar
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default InsightsChart;
