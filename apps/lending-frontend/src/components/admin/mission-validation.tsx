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
import { ContractTransactionResponse } from "ethers";
import { useMissions } from "../../hooks/useMissions";

type ValidationProps = {
  missionId: number;
  participant: string;
  xrpReward: number;
  kindReward: number;
};

export const MissionValidation = ({ missionId, participant, xrpReward, kindReward }: ValidationProps) => {
  const [isValidating, setIsValidating] = useState(false);
  const { contract } = useWeb3();
  const { validateParticipant, refreshMissions } = useMissions();
  const toast = useToast();

  const handleValidation = async () => {
    if (!contract) return;
    setIsValidating(true);

    try {
      // Appeler la fonction de validation qui gère à la fois le contrat et le localStorage
      await validateParticipant(missionId, participant);

      // Rafraîchir la liste des missions
      await refreshMissions();

      toast({
        title: "Mission validated",
        description: `Rewards sent: ${kindReward} KIND and ${xrpReward} XRP to ${participant}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Validation failed:", error);
      toast({
        title: "Validation failed",
        description: "An error occurred while validating the mission",
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
          <Text>Participant: {participant}</Text>
          <Text>Rewards: {kindReward} KIND + {xrpReward} XRP</Text>
          <Button
            colorScheme="green"
            onClick={handleValidation}
            isLoading={isValidating}
          >
            Validate & Send Rewards
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
}; 