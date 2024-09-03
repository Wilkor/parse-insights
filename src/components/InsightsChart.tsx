import React, { useEffect, useState } from 'react';
import metaApi from '../services/metaApi';
import { Insight } from '../models/Insight';
import { Grid, Box, Typography, Tooltip, Card, TextField, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress } from '@mui/material';
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
  const [loading, setLoading] = useState<boolean>(false);

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

  const handleOpenModal = async (prompt: string) => {
    setOpenModal(true);
    if (!pageAccessToken) {
      setAnalysis('Page access token is missing.');
      return;
    }

    setLoading(true); // Start loading
    try {
      const apiKey = 'sk-my9zSIJNboXHgDH6htWTRZaUcJB1wF-L0xvDu54lz6T3BlbkFJZNxan-O7B-3zT_ILKIPhH31llS_do3tNJ5538OOmkA'; // Utilize variáveis de ambiente para armazenar chaves de API
      const url = 'https://api.openai.com/v1/completions';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo-instruct',
          prompt: `${prompt}:\n\n${JSON.stringify(insights)}`,
          max_tokens: 300
        })
      });

      const result = await response.json();
      setAnalysis(result.choices[0].text);
    } catch (error) {
      console.error('Error fetching analysis:', error);
      setAnalysis('Failed to fetch analysis.');
    } finally {
      setLoading(false); // End loading
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const formatNumber = (insight: any) => {

    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(insight);

  }
  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Print</title></head><body>');
      printWindow.document.write('<h1>Análise com I.A</h1>');
      printWindow.document.write(`<div>${analysis}</div>`);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom></Typography>
      <Paper elevation={3} style={{ padding: '16px', marginBottom: '20px', marginTop: '30px' }}>
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {endDate && (
            <Button
              variant="contained"
              color="primary"
              style={{ margin: '16px', flex: 1 }} // Adiciona margem e faz com que os botões ocupem espaço flexível
              onClick={() => handleOpenModal('Analise os dados da campanha publicitária realizada na Meta, com o source_id. Avalie o desempenho do anúncio em termos de custo por resultado, taxa de cliques (CTR), e conversões. Identifique áreas que precisam de melhoria, especialmente relacionadas ao CTA. Dê feedbacks sobre o que funcionou bem e sugestões para otimizar o custo e melhorar a eficácia do CTA na próxima iteração da campanha.')}>
              Analise Detalhada
            </Button>
          )}

          {endDate && (
            <Button
              variant="contained"
              color="primary"
              style={{ margin: '16px', flex: 1 }} // Adiciona margem e faz com que os botões ocupem espaço flexível
              onClick={() => handleOpenModal('Analise rápida da campanha Meta source_id. Avalie custo por resultado, CTR e conversões, traga um breve feedback ao lado de cada dado. Dê insights e recomendações para otimização de forma gerencial macro. Retorne em tópicos: Custo por Resultado (CPR), Taxa de Clique (CTR), Conversões, com as propriedades: Valor e Feedback e Recomendações.')}
            >
              Análise Macro
            </Button>
          )}
        </div>

      </Paper>

      {endDate && (
        <>
          {/* Cards Section */}

          <Grid container spacing={3} style={{ marginBottom: '20px' }}>
            {
              [
                { label: 'Impressions', value: insight.impressions, tooltip: 'Número total de impressões recebidas' },
                { label: 'Reach', value: insight.reach, tooltip: 'Alcance total da campanha' },
                { label: 'Spend', value: `${formatNumber(insight.spend)}`, tooltip: 'Valor total gasto' },
                { label: 'Clicks', value: insight.clicks, tooltip: 'Número total de cliques' },
                { label: 'Unique Clicks', value: insight.unique_clicks, tooltip: 'Número total de cliques únicos' },
                { label: 'Frequency', value: insight.frequency, tooltip: 'Frequência média de exposição do anúncio' }

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

          {/* Modal for Detailed Analysis */}
          <Dialog open={openModal} onClose={handleCloseModal} fullWidth>
            <DialogTitle>Análise com I.A</DialogTitle>
            <DialogContent>
              {loading ? (
                <CircularProgress />
              ) : (
                <div>
                  <Typography variant="body1" paragraph>
                    {analysis}
                  </Typography>
                </div>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal}>Fechar</Button>
              <Button onClick={handlePrint} color="primary">Imprimir</Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default InsightsChart;
