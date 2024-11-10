import { 
  Box, 
  Container, 
  Heading, 
  VStack, 
  Card, 
  CardBody, 
  Flex, 
  Text, 
  Circle,
} from "@chakra-ui/react";
import { Medal } from "lucide-react";
import { BottomNavigation } from "../components/navigation/bottom-navigation";
import { useUser } from "../shared/contexts/user-context";
import { useWeb3 } from "../shared/contexts/web3-context";
import { useEffect } from "react";

interface LeaderboardEntry {
  position: number;
  name: string;
  kind: number;
  hasMedal?: boolean;
}

export const LeaderboardPage = () => {
  const { user } = useUser();
  const { kindBalance, refreshBalance } = useWeb3();

  const topUsers: LeaderboardEntry[] = [
    { position: 1, name: "Eva", kind: 6894, hasMedal: true },
    { position: 2, name: "Amaury", kind: 6432, hasMedal: true },
    { position: 3, name: "Adrien", kind: 6387, hasMedal: true },
    { position: 4, name: "Eden", kind: 6045 },
    { position: 5, name: "Eva", kind: 6012 },
    { position: 6, name: "Blocksync", kind: 5960 },
    { position: 7, name: "XRPLift", kind: 5878 },
    { position: 8, name: "Cryptique", kind: 5812 },
    { position: 9, name: "Loar4", kind: 5542 },
    { position: 10, name: "Exity", kind: 5521 }
  ];

  // Récupérer le solde KIND au chargement de la page
  useEffect(() => {
    if (user?.evmAddress) {
      refreshBalance(user.evmAddress);
    }
  }, [user]);

  // Rafraîchir le solde toutes les 10 secondes
  useEffect(() => {
    if (user?.evmAddress) {
      const interval = setInterval(() => {
        refreshBalance(user.evmAddress);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const currentUser: LeaderboardEntry = {
    position: 143,
    name: user?.username || "Unknown",
    kind: Number(kindBalance) || 0
  };

  const getGradientBg = (position: number) => {
    switch (position) {
      case 1:
        return "linear(to-r, yellow.300, yellow.400)";
      case 2:
        return "linear(to-r, gray.300, gray.400)";
      case 3:
        return "linear(to-r, orange.600, orange.700)";
      default:
        return "linear(to-r, orange.300, orange.400)";
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" pb="80px">
      {/* Header */}
      <Box position="sticky" top={0} zIndex={10} bg="white" p={4} borderBottom="1px" borderColor="gray.200">
        <Container maxW="container.lg">
          <Heading size="lg" color="orange.500">Leaderboard</Heading>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.lg" py={6}>
        <VStack spacing={6} maxW="md" mx="auto">
          <Heading size="lg" color="orange.500" alignSelf="flex-start">TOP 10</Heading>
          
          {/* Top 10 Leaderboard */}
          <VStack spacing={3} width="100%">
            {topUsers.map((user) => (
              <Card
                key={user.position}
                width="100%"
                bgGradient={getGradientBg(user.position)}
              >
                <CardBody>
                  <Flex justify="space-between" align="center">
                    <Flex align="center" gap={2}>
                      <Text fontSize="2xl" fontWeight="bold" minW="2rem">
                        {user.position}
                      </Text>
                      {user.hasMedal && (
                        <Medal size={20} color="purple" />
                      )}
                      <Text fontWeight="medium">{user.name}</Text>
                    </Flex>
                    <Text fontWeight="semibold">+ {user.kind.toLocaleString()} KIND</Text>
                  </Flex>
                </CardBody>
              </Card>
            ))}
          </VStack>

          {/* Pagination Dots */}
          <VStack spacing={1} py={4}>
            <Circle size="2" bg="gray.300" />
            <Circle size="2" bg="gray.300" />
            <Circle size="2" bg="gray.300" />
          </VStack>

          {/* Current User Position */}
          <Box width="100%">
            <Heading size="lg" color="orange.500" mb={3}>You</Heading>
            <Card bgGradient="linear(to-r, orange.300, orange.400)" width="100%">
              <CardBody>
                <Flex justify="space-between" align="center">
                  <Flex align="center" gap={2}>
                    <Text fontSize="2xl" fontWeight="bold" minW="2rem">
                      {currentUser.position}
                    </Text>
                    <Text fontWeight="medium">{currentUser.name}</Text>
                  </Flex>
                  <Text fontWeight="semibold">+ {currentUser.kind} KIND</Text>
                </Flex>
              </CardBody>
            </Card>
          </Box>
        </VStack>
      </Container>

      <BottomNavigation />
    </Box>
  );
}; 