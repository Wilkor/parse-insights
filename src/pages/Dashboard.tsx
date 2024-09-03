// src/pages/Dashboard.tsx
import React, { useState } from 'react';
import AdAccountsList from '../components/AdAccountsList';
import CampaignsList from '../components/CampaignsList';
import InsightsChart from '../components/InsightsChart';

const Dashboard: React.FC = () => {
  const [selectedAdAccountId, setSelectedAdAccountId] = useState<string | null>(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  return (
    <div>
      {/* <h1>Meta Insights Dashboard</h1>
      <AdAccountsList onSelect={setSelectedAdAccountId} />
      {selectedAdAccountId && <CampaignsList adAccountId={selectedAdAccountId} onSelect={setSelectedCampaignId} />}
      {selectedCampaignId && <InsightsChart campaignId={selectedCampaignId} />} */}
    </div>
  );
};

export default Dashboard;
