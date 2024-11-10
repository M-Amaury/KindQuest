import { theme } from "@chakra-ui/pro-theme"
import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import "@fontsource-variable/open-sans"
import "@fontsource-variable/spline-sans"
import { RouterProvider } from "react-router-dom"
import { Web3Provider } from "./shared/contexts/web3-context"
import { XRPLProvider } from "./shared/contexts/xrpl-context"
import { UserProvider } from "./shared/contexts/user-context"
import { router } from "./routes"

export const App = () => {
  const proTheme = extendTheme(theme)
  const extenstion = {
    colors: { ...proTheme.colors, brand: proTheme.colors.blue },
  }

  const myTheme = extendTheme(extenstion, proTheme)

  return (
    <ChakraProvider theme={myTheme}>
      <UserProvider>
        <XRPLProvider>
          <Web3Provider>
            <RouterProvider router={router} />
          </Web3Provider>
        </XRPLProvider>
      </UserProvider>
    </ChakraProvider>
  )
}
