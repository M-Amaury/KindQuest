import { Box, Container, Heading, Text, VStack, SimpleGrid, Progress } from "@chakra-ui/react";
import { BottomNavigation } from "../components/navigation/bottom-navigation";
import { useUser } from "../shared/contexts/user-context";
import { useWeb3 } from "../shared/contexts/web3-context";
import { useXRPL } from "../shared/contexts/xrpl-context";
import { useEffect, useState, useRef } from "react";
import { currentMissions, plannedMissions, historyMissions } from "./missions/types";
import { Card, CardBody, Flex, Button, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useDisclosure } from "@chakra-ui/react";
import { Cigarette } from "lucide-react";
import { CreateMissionForm } from "../components/admin/create-mission-form";
import { useMissions } from '../hooks/useMissions';
import { useToast } from "@chakra-ui/react";

const ADMIN_XRPL_ADDRESS = "rsnxpfwwWs6fVNaPVhGdKFBAukTPmC6NP5";

interface WeekProgress {
  week: number;
  points: number;
}

export const HomePage = () => {
  const { user, isAdmin } = useUser();
  const { kindBalance, refreshBalance } = useWeb3();
  const { xrpBalance, getXRPBalance } = useXRPL();
  const { availableMissions, plannedMissions, loading, subscribeMission, clearAllMissions } = useMissions();
  const [subscribingMissionId, setSubscribingMissionId] = useState<number | null>(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const weeklyProgress: WeekProgress[] = [
    { week: 1, points: 4 },
    { week: 2, points: 16 },
    { week: 3, points: 8 },
    { week: 4, points: 25 },
    { week: 5, points: 4 },
  ];

  useEffect(() => {
    if (user) {
      const xrplAddress = isAdmin ? ADMIN_XRPL_ADDRESS : user.xrplAddress;
      getXRPBalance(xrplAddress);
      refreshBalance(user.evmAddress);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        const xrplAddress = isAdmin ? ADMIN_XRPL_ADDRESS : user.xrplAddress;
        getXRPBalance(xrplAddress);
        refreshBalance(user.evmAddress);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [user, isAdmin]);

  const handleSubscribe = async (missionId: number) => {
    if (!user) return;

    setSubscribingMissionId(missionId);
    try {
      await subscribeMission(missionId, user.evmAddress, user.username);
      
      toast({
        title: "Subscribed to mission",
        description: "You have successfully subscribed to this mission",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to subscribe:", error);
      toast({
        title: "Failed to subscribe",
        description: "An error occurred while subscribing to the mission",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubscribingMissionId(null);
    }
  };

  const handleClearMissions = () => {
    console.log('Clear button clicked');
    clearAllMissions();
    onClose();
    
    // Ajouter un toast pour confirmer l'action
    toast({
      title: "Missions cleared",
      description: "All missions have been cleared successfully",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  if (!user) {
    return null;
  }

  // Interface administrateur
  if (isAdmin) {
    return (
      <Box pb="80px">
        <Container maxW="container.lg">
          <VStack spacing={8} align="stretch">
            {/* Welcome Section */}
            <Box>
              <Heading color="orange.500" size="lg">Admin Dashboard</Heading>
              <Text mt={2} color="gray.600">Manage missions and rewards</Text>
            </Box>

            {/* Stats Section */}
            <SimpleGrid columns={2} spacing={4}>
              <Box p={6} bg="orange.100" borderRadius="lg">
                <Text fontSize="sm" color="gray.600">Available XRP</Text>
                <Text fontSize="2xl" fontWeight="bold">{xrpBalance} XRP</Text>
                <Text fontSize="xs" color="gray.500">{ADMIN_XRPL_ADDRESS}</Text>
              </Box>
              <Box p={6} bg="orange.100" borderRadius="lg">
                <Text fontSize="sm" color="gray.600">Available KIND</Text>
                <Text fontSize="2xl" fontWeight="bold">{kindBalance} KIND</Text>
                <Text fontSize="xs" color="gray.500">{user.evmAddress}</Text>
              </Box>
            </SimpleGrid>

            {/* Create Mission Form */}
            <CreateMissionForm />

            {/* Admin Stats */}
            <SimpleGrid columns={2} spacing={4}>
              <Box p={6} bg="green.100" borderRadius="lg">
                <Text fontSize="sm" color="gray.600">Total Missions Created</Text>
                <Text fontSize="2xl" fontWeight="bold">15</Text>
              </Box>
              <Box p={6} bg="green.100" borderRadius="lg">
                <Text fontSize="sm" color="gray.600">Pending Validations</Text>
                <Text fontSize="2xl" fontWeight="bold">3</Text>
              </Box>
            </SimpleGrid>

            <Button
              colorScheme="red"
              onClick={onOpen}
              mt={4}
            >
              Clear All Missions
            </Button>

            <AlertDialog
              isOpen={isOpen}
              leastDestructiveRef={cancelRef}
              onClose={onClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    Clear All Missions
                  </AlertDialogHeader>

                  <AlertDialogBody>
                    Are you sure? This will remove all missions and their participants.
                    This action cannot be undone.
                  </AlertDialogBody>

                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                      Cancel
                    </Button>
                    <Button colorScheme="red" onClick={handleClearMissions} ml={3}>
                      Clear All
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </VStack>
        </Container>
        <BottomNavigation />
      </Box>
    );
  }

  // Interface utilisateur normal
  return (
    <Box pb="80px">
      <Container maxW="container.lg">
        <VStack spacing={8} align="stretch">
          {/* Welcome Section */}
          <Box>
            <Heading color="orange.500" size="lg">Welcome back, {user.username}!</Heading>
            <Text mt={2} color="gray.600">Here's your progress this week</Text>
          </Box>

          {/* Stats Section */}
          <SimpleGrid columns={2} spacing={4}>
            <Box p={6} bg="orange.100" borderRadius="lg">
              <Text fontSize="sm" color="gray.600">Total XRP</Text>
              <Text fontSize="2xl" fontWeight="bold">{xrpBalance} XRP</Text>
              <Text fontSize="xs" color="gray.500">{user.xrplAddress}</Text>
            </Box>
            <Box p={6} bg="orange.100" borderRadius="lg">
              <Text fontSize="sm" color="gray.600">Total KIND</Text>
              <Text fontSize="2xl" fontWeight="bold">{kindBalance} KIND</Text>
              <Text fontSize="xs" color="gray.500">{user.evmAddress}</Text>
            </Box>
          </SimpleGrid>

          {/* Weekly Progress */}
          <Box p={6} bg="white" shadow="sm" borderRadius="lg">
            <Text fontSize="lg" fontWeight="bold" mb={4}>Weekly Progress</Text>
            <SimpleGrid columns={5} spacing={4} mb={4}>
              {weeklyProgress.map((week, index) => (
                <VStack key={`week-${week.week}`} spacing={1}>
                  <Text fontSize="xs" color="gray.600">Week {week.week}</Text>
                  <Text fontSize="sm" fontWeight="medium">+{week.points}</Text>
                </VStack>
              ))}
            </SimpleGrid>
            <Progress value={60} size="sm" colorScheme="orange" />
          </Box>

          {/* Current Missions */}
          <Box>
            <Heading size="lg" color="orange.500" mb={3}>Available Missions</Heading>
            <VStack spacing={3}>
              {loading ? (
                <Text>Loading missions...</Text>
              ) : availableMissions.filter(mission => mission.active).map((mission) => (
                <Card
                  key={`available-${mission.id}`}
                  p={4}
                  bgGradient="linear(to-r, amber.200, amber.300)"
                >
                  <CardBody>
                    <Flex justify="space-between" align="start" mb={2}>
                      <Flex gap={2}>
                        <Cigarette size={20} />
                        <Heading size="sm">{mission.title}</Heading>
                      </Flex>
                      <Box textAlign="right">
                        <Text fontWeight="semibold">+ {mission.xrpReward} XRP</Text>
                        <Text fontWeight="semibold">+ {mission.xpReward} KIND</Text>
                      </Box>
                    </Flex>
                    <VStack align="start" spacing={1} mb={3}>
                      <Text color="gray.700">{mission.description}</Text>
                    </VStack>
                    <Button
                      variant="outline"
                      bg="white"
                      _hover={{ bg: "gray.100" }}
                      w="24"
                      onClick={() => handleSubscribe(mission.id)}
                      isLoading={subscribingMissionId === mission.id}
                      isDisabled={mission.participants?.some(
                        (p: { address: string }) => p.address === user?.evmAddress
                      )}
                    >
                      {mission.participants?.some(
                        (p: { address: string }) => p.address === user?.evmAddress
                      ) 
                        ? "Subscribed" 
                        : "Subscribe"}
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </Box>

          {/* Planned Missions */}
          <Box>
            <Heading size="lg" color="orange.500" mb={3}>Missions Planned</Heading>
            <VStack spacing={3}>
              {plannedMissions.map((mission) => (
                <Card key={`planned-${mission.id}`} p={4} bg="amber.100">
                  <CardBody>
                    <Flex justify="space-between" align="start" mb={2}>
                      <Flex gap={2}>
                        <Cigarette size={20} />
                        <Box>
                          <Heading size="sm">Mission planned</Heading>
                          <Text>{mission.title}</Text>
                        </Box>
                      </Flex>
                      <Box textAlign="right">
                        <Text fontWeight="semibold">+ {mission.xrpReward} XRP</Text>
                        <Text fontWeight="semibold">+ {mission.xpReward} KIND</Text>
                      </Box>
                    </Flex>
                    <VStack align="start" spacing={1} mb={3}>
                      <Text color="gray.700">{mission.description}</Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </Box>

          {/* Mission History */}
          <Box>
            <Heading size="lg" color="orange.500" mb={3}>Missions History</Heading>
            <VStack spacing={3}>
              {historyMissions.map((mission) => (
                <Card key={`history-${mission.id}`} p={4} bg={mission.status === "validated" ? "green.100" : "red.100"}>
                  <CardBody>
                    <Flex justify="space-between" align="start">
                      <Flex gap={2}>
                        <Cigarette size={20} />
                        <Box>
                          <Heading size="sm">
                            Mission {mission.status}
                          </Heading>
                          <Text>Cigarette butt collection</Text>
                          <Text color="gray.600">{mission.date}</Text>
                        </Box>
                      </Flex>
                      <Box textAlign="right">
                        <Text fontWeight="semibold">+ {mission.xrp} XRP</Text>
                        <Text fontWeight="semibold">+ {mission.kind} KIND</Text>
                      </Box>
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
