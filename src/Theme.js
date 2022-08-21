import {StepsStyleConfig as Steps} from 'chakra-ui-steps'
import {extendTheme, ChakraProvider} from '@chakra-ui/react'

 const theme = extendTheme({
    components: {
      Steps,
    },
  });

  export default theme