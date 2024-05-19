import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider, http, createConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mandeChain = {
  id: 28768,
  name: 'Mande Network',
  iconUrl: 'https://app.mande.network/static/media/mandeLogo.adf3ad93dd2f4ef04578da26b715bf6e.svg',
  iconBackground: '#fff',
  nativeCurrency: { name: 'Mande', symbol: 'MAND', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://json-rpc.mande.evm.ra.intdev.noisnemyd.xyz'] },
  }
};

const config = createConfig({
  appName: 'Mande Network',
  chains: [
    mandeChain,
  ],
  transports: {
    [mandeChain.id]: http(),
  },
});

const queryClient = new QueryClient();

const myCustomTheme = {
  colors: {
    accentColor: 'black',
    accentColorForeground: 'white',
    profileActionHover: ''
  },
  fonts: {
    body: '...',
  },
  radii: {
    connectButton: '0',
  },
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={darkTheme({
            accentColor: 'black',
            accentColorForeground: 'white',
            borderRadius: 'none',
            fontStack: 'system',
            overlayBlur: 'none',
          })}>
            <App />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </BrowserRouter>
  </React.StrictMode>
);
