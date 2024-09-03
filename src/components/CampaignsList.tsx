import React, { useEffect, useState } from 'react';
import { CircularProgress, FormControl, InputLabel, MenuItem, Select, Button, Typography, Alert, SelectChangeEvent } from '@mui/material';
import metaApi from '../services/metaApi';
import { Campaign } from '../models/Campaign';
import { AdAccount } from '../models/AdAccount';

interface CampaignsListProps {
  onSelect: (campaignId: string) => void;
  pageAccessToken: string | null;
}

const CampaignsList: React.FC<CampaignsListProps> = ({ onSelect, pageAccessToken }) => {
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedAdAccountId, setSelectedAdAccountId] = useState<string | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdAccounts = async () => {
      if (!pageAccessToken) {
        setError('Page access token is missing.');
        return;
      }

      try {
        setLoading(true);
        const response = await metaApi.getAdAccounts(pageAccessToken);
        setAdAccounts(response);
      } catch (err) {
        setError('Failed to load ad accounts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchAdAccounts();
  }, [pageAccessToken]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (!selectedAdAccountId || !pageAccessToken) return;

      try {
        setLoading(true);
        const data = await metaApi.getCampaigns(selectedAdAccountId, pageAccessToken);
        setCampaigns(data);
      } catch (err) {
        setError('Failed to load campaigns. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [selectedAdAccountId, pageAccessToken]);

  const handleAdAccountChange = (event: SelectChangeEvent<string>) => {
    setSelectedAdAccountId(event.target.value);
    setSelectedCampaignId(null);
  };

  const handleCampaignChange = (event: SelectChangeEvent<string>) => {
    setSelectedCampaignId(event.target.value);
  };

  const handleConfirmSelection = () => {
    if (selectedCampaignId) {
      onSelect(selectedCampaignId);
    }
  };

  return (
    <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant="h6" gutterBottom>Select Campaign</Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <>
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel id="ad-account-select-label">Select an ad account</InputLabel>
            <Select
              labelId="ad-account-select-label"
              value={selectedAdAccountId || ''}
              onChange={handleAdAccountChange}
              label="Select an ad account"
            >
              <MenuItem value="" disabled>Select an ad account</MenuItem>
              {adAccounts.map(adAccount => (
                <MenuItem key={adAccount.id} value={adAccount.id}>
                  {adAccount.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedAdAccountId && (
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="campaign-select-label">Select a campaign</InputLabel>
              <Select
                labelId="campaign-select-label"
                value={selectedCampaignId || ''}
                onChange={handleCampaignChange}
                label="Select a campaign"
              >
                <MenuItem value="" disabled>Select a campaign</MenuItem>
                {campaigns.map(campaign => (
                  <MenuItem key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmSelection}
            disabled={!selectedCampaignId}
            fullWidth
            style={{ marginTop: '16px' }}
          >
            OK
          </Button>
        </>
      )}
    </div>
  );
};

export default CampaignsList;
