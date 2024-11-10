import { 
  Box, 
  Container, 
  Heading, 
  VStack, 
  Card, 
  CardBody, 
  Flex, 
  Text, 
  Progress,
  Button,
  useToast,
} from "@chakra-ui/react";
import { Building2, Clapperboard, Laptop, ShoppingBag } from "lucide-react";
import { BottomNavigation } from "../components/navigation/bottom-navigation";
import { useUser } from "../shared/contexts/user-context";
import { useWeb3 } from "../shared/contexts/web3-context";
import { useState } from "react";
import { ethers } from "ethers";
import { ContractTransactionResponse } from "ethers";

interface Offer {
  id: number;
  title: string;
  kind: number;
  icon: "museum" | "movie" | "shop" | "dev";
}

interface HistoryItem {
  id: number;
  title: string;
  kind: number;
  date: string;
  icon: "museum" | "movie" | "shop" | "dev" | "ticket";
}

export const ExperiencePage = () => {
  const { user } = useUser();
  const { kindBalance, contract, refreshBalance } = useWeb3();
  const toast = useToast();
  const [isExchanging, setIsExchanging] = useState<number | null>(null);

  const offers: Offer[] = [
    { id: 1, title: "Louvre Museum ticket", kind: 30, icon: "museum" },
    { id: 2, title: "Movie ticket", kind: 35, icon: "movie" },
    { id: 3, title: "-10% at a local store", kind: 35, icon: "shop" },
    { id: 4, title: "Grévin Museum ticket", kind: 30, icon: "museum" },
    { id: 5, title: "-20% at a local store", kind: 60, icon: "shop" },
    { id: 6, title: "Dev formation", kind: 100, icon: "dev" },
  ];

  const history: HistoryItem[] = [
    { id: 1, date: "Saturday 9 November", title: "Dev formation", kind: 100, icon: "dev" },
    { id: 2, date: "Monday 4 October", title: "-10% at a local store", kind: 30, icon: "shop" },
    { id: 3, date: "Sunday 3 October", title: "Dance spectacle ticket", kind: 50, icon: "ticket" },
  ];

  const handleExchange = async (offer: Offer) => {
    if (!contract || !user) return;

    try {
      setIsExchanging(offer.id);
      const amount = ethers.parseEther(offer.kind.toString());

      // Au lieu d'appeler burn directement, on appelle burnFrom depuis l'admin
      const tx = await contract.burnFrom(user.evmAddress, amount) as ContractTransactionResponse;
      await tx.wait();

      // Rafraîchir le solde
      await refreshBalance(user.evmAddress);

      toast({
        title: "Exchange successful!",
        description: `You exchanged ${offer.kind} KIND for ${offer.title}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

    } catch (error) {
      console.error("Exchange failed:", error);
      toast({
        title: "Exchange failed",
        description: "Failed to exchange KIND tokens. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsExchanging(null);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "museum":
        return <Building2 size={24} />;
      case "movie":
        return <Clapperboard size={24} />;
      case "shop":
        return <ShoppingBag size={24} />;
      case "dev":
        return <Laptop size={24} />;
      case "ticket":
        return <Clapperboard size={24} />;
      default:
        return null;
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" pb="80px">
      {/* Header */}
      <Box position="sticky" top={0} zIndex={10} bg="gray.50">
        <Box p={4}>
          <Flex justify="space-between" align="center" mb={6}>
            <Box>
              <Heading color="orange.500" size="lg">Exchange your KIND</Heading>
              <Text fontSize="3xl" fontWeight="bold">{kindBalance} KIND</Text>
            </Box>
          </Flex>
          
          <Box>
            <Flex justify="space-between" mb={2}>
              {[1, 2, 3, 4, 5].map((week) => (
                <Text key={week} fontSize="sm" color="gray.600">
                  Week {week}
                </Text>
              ))}
            </Flex>
            <Box position="relative" mb={2}>
              <Progress value={33} size="sm" colorScheme="orange" />
            </Box>
            <Flex justify="space-between">
              {["x1", "x1.5", "x2", "x2.5", "x3"].map((multiplier, index) => (
                <Text key={index} fontSize="sm" color="gray.600">
                  {multiplier}
                </Text>
              ))}
            </Flex>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Container maxW="container.lg" py={6}>
        <VStack spacing={6} align="stretch">
          {/* Offers */}
          <Box>
            <Heading size="lg" color="orange.500" mb={3}>Offers</Heading>
            <VStack spacing={3}>
              {offers.map((offer) => (
                <Card key={offer.id} bgGradient="linear(to-r, amber.200, amber.300)" width="100%">
                  <CardBody>
                    <Flex justify="space-between" align="center">
                      <Flex align="center" gap={3}>
                        {getIcon(offer.icon)}
                        <Text fontWeight="semibold">{offer.title}</Text>
                      </Flex>
                      <Flex align="center" gap={2}>
                        <Text fontWeight="bold" color="gray.700">-{offer.kind} KIND</Text>
                        <Button 
                          variant="outline" 
                          bg="white" 
                          _hover={{ bg: "gray.100" }}
                          onClick={() => handleExchange(offer)}
                          isLoading={isExchanging === offer.id}
                          isDisabled={Number(kindBalance) < offer.kind}
                        >
                          exchange
                        </Button>
                      </Flex>
                    </Flex>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </Box>

          {/* History */}
          <Box>
            <Heading size="lg" color="orange.500" mb={3}>Offers history</Heading>
            <VStack spacing={3}>
              {history.map((item) => (
                <Card key={item.id} bg="amber.50" width="100%">
                  <CardBody>
                    <Flex justify="space-between" align="center">
                      <Flex align="center" gap={3}>
                        {getIcon(item.icon)}
                        <Box>
                          <Text fontSize="sm" color="gray.600">{item.date}</Text>
                          <Text fontWeight="semibold">{item.title}</Text>
                        </Box>
                      </Flex>
                      <Text fontWeight="bold" color="gray.700">-{item.kind} KIND</Text>
                    </Flex>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </Box>
        </VStack>
      </Container>

      <BottomNavigation />
    </Box>
  );
};