import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {WagmiConfig, createClient}  from 'wagmi'
import { getDefaultProvider } from 'ethers'
import {MoralisProvider} from 'react-moralis'
import {ChakraProvider} from '@chakra-ui/react'
import {ApolloProvider} from '@apollo/client'
import {apolloClient} from './GRAPHQL/Authentication/appoloClient'
import { configureChains, chain } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import {BrowserRouter} from 'react-router-dom'
import {StepsStyleConfig as Steps} from 'chakra-ui-steps'
import {extendTheme} from '@chakra-ui/react'

import {NotificationProvider} from 'web3uikit'


const theme = extendTheme({
  components: {
    Steps,
  },
});

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, chain.polygon],
  [publicProvider()],
)

const wagmiClient = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

/*const wagmiClient = createClient({
    autoConnect: true,
    provider: getDefaultProvider(),
  })*/


  
const root = ReactDOM.createRoot(document.getElementById('root'));
 
root.render(
  <ChakraProvider theme={theme}>
    <ApolloProvider client={apolloClient}>
    <MoralisProvider appId={process.env.REACT_APP_MORALIS_APP_ID} serverUrl={process.env.REACT_APP_MORALIS_SERVER_URL }>
    <WagmiConfig client={wagmiClient}>
     <BrowserRouter>
     <NotificationProvider>
       <App />
       </NotificationProvider>
       </BrowserRouter>
       </WagmiConfig>
      </MoralisProvider>
      </ApolloProvider>
  </ChakraProvider>
 
);