import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";
import { useState } from "react";

type Mission = {
  id: number;
  title: string;
  description: string;
  xpReward: number;
  xrpReward: number;
  active: boolean;
  date: string;
  time: string;
  location: string;
};

export const AvailableMissions = () => {
  const [missions] = useState<Mission[]>([
    {
      id: 1,
      title: "Fundraising for Causes",
      description: "Help raise funds for local community projects",
      xpReward: 100,
      xrpReward: 50,
      active: true,
      date: "Monday 11 Novembre",
      time: "9 AM - 12 AM",
      location: "84 rue Beaubourg, 75003 Paris",
    },
    {
      id: 2,
      title: "Food Distribution",
      description: "Distribute food to homeless shelters",
      xpReward: 150,
      xrpReward: 75,
      active: true,
      date: "Tuesday 12 Novembre",
      time: "6 PM - 9 PM",
      location: "17 rue Turbigo, 75013 Paris",
    },
    {
      id: 3,
      title: "Community Cleanup",
      description: "Help clean up local parks and streets",
      xpReward: 80,
      xrpReward: 40,
      active: true,
      date: "Wednesday 13 Novembre",
      time: "2 PM - 6 PM",
      location: "46 rue du Bac, 75007 Paris",
    },
  ]);

  return (
    <Stack spacing={4}>
      <Heading size="lg" color="orange.500" mb={4}>Available Missions</Heading>
      <SimpleGrid columns={1} spacing={4}>
        {missions.map((mission) => (
          <Card key={mission.id} bg="orange.100" shadow="md">
            <CardHeader>
              <Heading size="md">{mission.title}</Heading>
            </CardHeader>
            <CardBody>
              <Text>{mission.description}</Text>
              <Box mt={4}>
                <Text fontWeight="bold">Date: {mission.date}</Text>
                <Text fontWeight="bold">Time: {mission.time}</Text>
                <Text fontWeight="bold">Location: {mission.location}</Text>
              </Box>
              <Box mt={4}>
                <Text fontWeight="bold">Rewards:</Text>
                <Text>• {mission.xpReward} EXP</Text>
                <Text>• {mission.xrpReward} XRP</Text>
              </Box>
              <Button mt={4} colorScheme="orange" width="full">
                Join Mission
              </Button>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );
}; 