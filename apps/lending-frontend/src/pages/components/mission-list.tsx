import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  Text,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { MissionValidation } from "../../components/admin/mission-validation";
import { useUser } from "../../shared/contexts/user-context";
import { useMissions } from '../../hooks/useMissions';
import { Mission } from '../../types/mission.types';

export const MissionList = () => {
  const { isAdmin } = useUser();
  const { availableMissions, plannedMissions, loading } = useMissions();

  if (loading) {
    return <Box>Loading missions...</Box>;
  }

  // Pour l'admin, on montre toutes les missions
  const missionsToShow = isAdmin ? [...availableMissions, ...plannedMissions] : availableMissions;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'validated':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Stack spacing={4}>
      <Heading size="lg" color="orange.500" mb={4}>
        {isAdmin ? "All Missions" : "Available Missions"}
      </Heading>
      {missionsToShow.map((mission: Mission) => (
        <Card key={mission.id} bg="white" shadow="md">
          <CardHeader>
            <Heading size="md">{mission.title}</Heading>
            {isAdmin && mission.status && (
              <Badge colorScheme={mission.status === 'planned' ? 'orange' : 'green'} mt={2}>
                {mission.status}
              </Badge>
            )}
          </CardHeader>
          <CardBody>
            <Text>{mission.description}</Text>
            <Box mt={4}>
              <Text fontWeight="bold">Rewards:</Text>
              <Text>• {mission.xpReward} KIND</Text>
              <Text>• {mission.xrpReward} XRP</Text>
            </Box>
            {isAdmin && mission.participants && mission.participants.length > 0 && (
              <VStack mt={6} spacing={4} align="stretch">
                <Heading size="sm">
                  Participants ({mission.participants.length})
                </Heading>
                {mission.participants.map(participant => (
                  <Box 
                    key={participant.address} 
                    p={4} 
                    bg="gray.50" 
                    borderRadius="md"
                    border="1px"
                    borderColor="gray.200"
                  >
                    <HStack justify="space-between" mb={2}>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold">{participant.username}</Text>
                        <Text fontSize="sm" color="gray.600">
                          {participant.address.slice(0, 6)}...{participant.address.slice(-4)}
                        </Text>
                      </VStack>
                      <Badge colorScheme={getStatusColor(participant.status)}>
                        {participant.status}
                      </Badge>
                    </HStack>
                    {participant.status === 'pending' && (
                      <MissionValidation
                        missionId={mission.id}
                        participant={participant.address}
                        xrpReward={mission.xrpReward}
                        kindReward={mission.xpReward}
                      />
                    )}
                  </Box>
                ))}
              </VStack>
            )}
            {isAdmin && (!mission.participants || mission.participants.length === 0) && (
              <Text mt={4} color="gray.500" textAlign="center">
                No participants yet
              </Text>
            )}
          </CardBody>
        </Card>
      ))}
      {missionsToShow.length === 0 && (
        <Text textAlign="center" color="gray.500">
          {isAdmin ? "No missions created yet" : "No available missions"}
        </Text>
      )}
    </Stack>
  );
}; 