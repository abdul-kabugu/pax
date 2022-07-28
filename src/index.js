import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {MoralisProvider} from 'react-moralis'
import {ApolloProvider } from '@apollo/client'
import { client, apolloClient } from '../src/utils/appolo-client';
import {ChakraProvider, ColorModeScript} from '@chakra-ui/react'
import { theme } from './Theme';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';

const { chains, provider } = configureChains(
  [chain.polygon], // you can add more chains here like chain.mainnet, chain.optimism etc.
  [
    jsonRpcProvider({
      rpc: () => {
        return {
          http: 'https://rpc.ankr.com/polygon', // go to https://www.ankr.com/protocol/ to get a free RPC for your network if you're not using Polygon
        };
      },
    }),
    publicProvider(),
  ]
);

/*const { connectors } = getDefaultWallets({
  appName: 'Next.js Chakra Rainbowkit Wagmi Starter',
  chains,
});*/

const wagmiClient = createClient({
  autoConnect: false,
 // connectors,
  provider,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
     <ChakraProvider>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <MoralisProvider appId="eREYueyBkzvQbb1oM77uaFHN9Jbak97b1k1oG5La" serverUrl="https://5msfvk6e2mxu.usemoralis.com:2053/server">
    <WagmiConfig client={wagmiClient}>
      <ApolloProvider client={apolloClient}>
       <App />
    </ApolloProvider>
   </WagmiConfig>
    </MoralisProvider>
    </ChakraProvider>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
