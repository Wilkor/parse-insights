// src/components/AdAccountsList.tsx
import React, { useEffect, useState } from 'react';
import metaApi from '../services/metaApi';
import { AdAccount } from '../models/AdAccount';

// Defina a interface para as propriedades esperadas
interface AdAccountsListProps {
  onSelect: React.Dispatch<React.SetStateAction<string | null>>;
}

const AdAccountsList: React.FC<AdAccountsListProps> = ({ onSelect }) => {
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([]);

  useEffect(() => {
    const fetchAdAccounts = async () => {
      const data = await metaApi.getAdAccounts();
      setAdAccounts(data);
    };
    fetchAdAccounts();
  }, []);

  return (
    <div>
      <h2>Ad Accounts</h2>
      <ul>
        {adAccounts.map(account => (
          <li key={account.id}>
            <button onClick={() => onSelect(account.id)}>{account.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdAccountsList;
