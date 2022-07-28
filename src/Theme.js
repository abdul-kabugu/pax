// 1. import `extendTheme` function
import { extendTheme } from '@chakra-ui/react'

// 2. Add your color mode config
/*const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}*/

 const config = extendTheme({
    layerStyles: {
      base: {
        bg: 'gray.50',
        border: '2px solid',
        borderColor: 'gray.500',
      },
      selected: {
        bg: 'red.200',
        color: "red.700",//'teal.700',
        borderColor: 'orange.500',
      },
    },

   /* config : {
        initialColorMode: 'dark',
        useSystemColorMode: false,
      }*/
  })

// 3. extend the theme
export const theme = extendTheme({ config })

//export default theme