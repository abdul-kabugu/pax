import {StepsStyleConfig as Steps} from 'chakra-ui-steps'
import {extendTheme, ChakraProvider} from '@chakra-ui/react'

export const theme = extendTheme({
    components: {
      Steps,
    },
  });