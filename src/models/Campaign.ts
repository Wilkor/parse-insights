// src/models/Campaign.ts

export interface Campaign {
    id: string;
    name: string;
    status: string;
  }
  
  export interface CampaignResponse {
    data: Campaign[];
    paging: {
      cursors: {
        before: string;
        after: string;
      };
    };
  }
  