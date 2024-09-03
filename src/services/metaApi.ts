// src/services/metaApi.ts
import axios from 'axios';
import { AdAccount } from '../models/AdAccount';
import { Campaign } from '../models/Campaign';
import { Insight } from '../models/Insight';

const API_VERSION = 'v20.0';
const ACCESS_TOKEN = 'EAAEJjeZCHUS8BO47xwyFAXLFWZCm4TOeCLivOIuYyZC2J3OgpU9Fg33zsvEQ0SZBpOqZBZCm3bVu17BNpkZCKzaCncB4yyhl2OMxJgQ9n3K2O6K9QvVkn2Xn37zedLmcC8E3PEpVBzp5A4NDRFDDVb7d9ahwVdyDSml1797tPvNPWZC4YNAwtGdqjXfK';

const metaApi = {
  getAdAccounts: async (pageAccessToken?:string): Promise<AdAccount[]> => {
    const response = await axios.get(
      `https://graph.facebook.com/${API_VERSION}/me/adaccounts?access_token=${pageAccessToken}&fields=id,name,account_status`
    );
    return response.data.data;
  },

  getCampaigns: async (adAccountId: string, pageAccessToken:string): Promise<Campaign[]> => {
    const response = await axios.get(
      `https://graph.facebook.com/${API_VERSION}/${adAccountId}/campaigns?access_token=${pageAccessToken}&fields=id,name,status&effective_status[]=ACTIVE`
    );
    return response.data.data;
  },

  getInsights: async (campaignId: string, startDate?: string, endDate?: string, pageAccessToken?:string): Promise<Insight[]> => {
    const fields = 'objective,campaign_name,impressions,reach,spend,clicks,unique_clicks,frequency,unique_actions,actions';
    const response = await axios.get(
      `https://graph.facebook.com/${API_VERSION}/${campaignId}/insights`,
      {
        params: {
          access_token: pageAccessToken,
          fields: fields,
          time_range: startDate && endDate ? JSON.stringify({ since: startDate, until: endDate }) : undefined
        }
      }
    );
    return response.data.data;
  },
};

export default metaApi;
