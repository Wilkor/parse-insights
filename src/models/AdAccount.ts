// src/models/AdAccount.ts
export interface AdAccount {
    id: string;
    name: string;
    account_status: number;
  }
  
  // src/models/Campaign.ts
  export interface Campaign {
    id: string;
    name: string;
    status: string;
  }
  
  // src/models/Insight.ts
  export interface Insight {
    objective: string;
    adset_name: string;
    campaign_name: string;
    ad_name: string;
    impressions: string;
    reach: string;
    spend: string;
    clicks: string;
    unique_clicks: string;
    frequency: string;
    unique_actions: Action[];
    actions: Action[];
    date_start: string;
    date_stop: string;
  }
  
  interface Action {
    action_type: string;
    value: string;
  }
  