import * as React from 'react'

// 1. import `ChakraProvider` component
import { ChakraProvider } from '@chakra-ui/react'
import { ShopContext, XRPContext } from "./context";
import EmbedRoute from './routes/embed/Embed';
import { parseQuery } from "./utils/url";
const { shop = '' } = parseQuery(window.location.search);

function App(props) {
  // 2. Wrap ChakraProvider at the root of your app
  return (
    <ChakraProvider>
      <XRPContext.Provider value={{ wallet: props.wallet, client: props.client }}>
        <ShopContext.Provider value={shop}>
          <EmbedRoute />
        </ShopContext.Provider>
      </XRPContext.Provider>
    </ChakraProvider>
  )
}

export default App;