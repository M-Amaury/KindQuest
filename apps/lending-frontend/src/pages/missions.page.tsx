import {
  Box,
  Container,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { BottomNavigation } from "../components/navigation/bottom-navigation";
import { MissionList } from "./components/mission-list";
import { useUser } from "../shared/contexts/user-context";

export const MissionsPage = () => {
  const { user, isAdmin } = useUser();

  if (!user) {
    return null;
  }

  return (
    <Box pb="80px">
      <Container maxW="container.lg">
        <VStack spacing={8} align="stretch">
          <Heading color="orange.500" size="lg">
            {isAdmin ? "Missions to Validate" : "Available Missions"}
          </Heading>
          <MissionList />
        </VStack>
      </Container>
      <BottomNavigation />
    </Box>
  );
}; 