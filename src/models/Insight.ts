// src/models/Insight.ts

export interface Action {
    action_type: string;
    value: string;
  }
  
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
  
  export interface InsightResponse {
    data: Insight[];
    paging: {
      cursors: {
        before: string;
        after: string;
      };
    };
  }
  