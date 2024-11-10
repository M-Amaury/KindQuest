import {
  Button,
  Card,
  CardBody,
  Heading,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useWeb3 } from "../../shared/contexts/web3-context";
import { useState } from "react";
import { useMissions } from "../../hooks/useMissions";

type ValidationProps = {
  missionId: number;
  participant: string; // Adresse EVM du participant
  kindReward: number;
  xrpReward: number;
};

export const MissionValidation = ({ missionId, participant, kindReward }: ValidationProps) => {
  const [isValidating, setIsValidating] = useState(false);
  const { contract } = useWeb3();
  const { validateParticipant, refreshMissions } = useMissions();
  const toast = useToast();

  const handleValidation = async () => {
    if (!contract) {
      toast({
        title: "Error",
        description: "Smart contract not connected",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsValidating(true);

    try {
      // Valider la mission et envoyer les KIND au participant
      console.log(`Validating mission ${missionId} for participant ${participant}`);
      await validateParticipant(missionId, participant);
      console.log("Mission validated successfully");

      // Rafraîchir la liste des missions
      await refreshMissions();

      toast({
        title: "Mission validated",
        description: `${kindReward} KIND sent to ${participant.slice(0, 6)}...${participant.slice(-4)}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Validation failed:", error);
      toast({
        title: "Validation failed",
        description: error instanceof Error ? error.message : "An error occurred while validating the mission",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Card>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <Heading size="sm">Mission Validation</Heading>
          <Text>Participant: {participant.slice(0, 6)}...{participant.slice(-4)}</Text>
          <Text>Reward: {kindReward} KIND</Text>
          <Button
            colorScheme="green"
            onClick={handleValidation}
            isLoading={isValidating}
            isDisabled={!contract}
          >
            Validate & Send KIND
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
}; 