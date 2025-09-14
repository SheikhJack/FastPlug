import React, { useState, useEffect, createContext, ReactNode } from 'react';
import { Configuration } from '@/lib/configurationApi';
import { configurationApi } from '@/lib/configurationApi';
import { isErrorResponse } from '@/lib/api'; // Import the type guard

interface ConfigurationContextType {
  currency: string;
  currencySymbol: string;
  deliveryCharges: number;
  loading: boolean;
  error?: string;
  refreshConfiguration?: () => Promise<void>;
}

const defaultConfiguration: ConfigurationContextType = {
  currency: '',
  currencySymbol: '',
  deliveryCharges: 0,
  loading: true,
};

const ConfigurationContext = createContext<ConfigurationContextType>(defaultConfiguration);

interface ConfigurationProviderProps {
  children: ReactNode;
}

export const ConfigurationProvider: React.FC<ConfigurationProviderProps> = (props) => {
  const [config, setConfig] = useState<ConfigurationContextType>(defaultConfiguration);

  const loadConfiguration = async () => {
    try {
      const response = await configurationApi.getConfiguration();
      
      if (isErrorResponse(response)) {
        // Error case
        setConfig({
          currency: '',
          currencySymbol: '',
          deliveryCharges: 0,
          loading: false,
          error: response.error,
        });
      } else {
        // Success case
        setConfig({
          currency: response.data.currency,
          currencySymbol: response.data.currencySymbol,
          deliveryCharges: response.data.deliveryCharges,
          loading: false,
        });
      }
    } catch (error) {
      setConfig({
        currency: '',
        currencySymbol: '',
        deliveryCharges: 0,
        loading: false,
        error: 'Failed to load configuration',
      });
    }
  };

  useEffect(() => {
    loadConfiguration();
  }, []);

  const refreshConfiguration = async () => {
    setConfig(prev => ({ ...prev, loading: true }));
    await loadConfiguration();
  };

  const contextValue: ConfigurationContextType = {
    ...config,
    refreshConfiguration,
  };

  return (
    <ConfigurationContext.Provider value={contextValue}>
      {props.children}
    </ConfigurationContext.Provider>
  );
};

export const ConfigurationConsumer = ConfigurationContext.Consumer;
export default ConfigurationContext;