import { Flex, Text } from "@chakra-ui/react"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { useWeb3 } from "../../shared/contexts"

/**
 * Ignore, component not used anymore!!
 */
export const MyBalance = () => {
  const [balance, setBalance] = useState(0)
  const { contract } = useWeb3()

  useEffect(() => {
    const checkBalance = async () => {
      if (!contract) {
        setBalance(0)
        return
      }

      const rawBalance = await contract.getBalance()

      // Format ETH balance and parse it to JS number
      const value = parseFloat(ethers.formatEther(rawBalance))

      setBalance(value)
    }

    // initially get the balance
    checkBalance()

    // then regularly check the balance
    const interval = setInterval(() => {
      checkBalance()
    }, 2800)

    return () => clearInterval(interval)
  }, [contract])

  return (
    <Flex gap={6} backgroundColor="blue.50" p="5" borderRadius="2xl">
      <Text fontSize="2xl" as="b">
        My balance:
      </Text>
      <Text fontSize="2xl">{balance} XRP</Text>
    </Flex>
  )
}
