import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  NumberInput,
  NumberInputField,
  Textarea,
  Card,
  CardBody,
  CardHeader,
  Heading,
} from "@chakra-ui/react";
import { useState } from "react";
import { useWeb3 } from "../../shared/contexts/web3-context";
import { ContractTransactionResponse } from "ethers";
import { useMissions } from '../../hooks/useMissions';

export const CreateMissionForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [xpReward, setXpReward] = useState("");
  const [xrpReward, setXrpReward] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const toast = useToast();
  const { createMission } = useMissions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createMission({
        title,
        description,
        xpReward: Number(xpReward),
        xrpReward: Number(xrpReward),
        active: true
      });

      toast({
        title: "Mission created",
        description: "The mission has been created successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setXpReward("");
      setXrpReward("");
    } catch (error) {
      console.error("Failed to create mission:", error);
      toast({
        title: "Error",
        description: "Failed to create mission. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <Heading size="md">Create New Mission</Heading>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Mission title"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mission description"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>KIND Reward</FormLabel>
              <NumberInput min={0}>
                <NumberInputField
                  value={xpReward}
                  onChange={(e) => setXpReward(e.target.value)}
                  placeholder="KIND reward amount"
                />
              </NumberInput>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>XRP Reward</FormLabel>
              <NumberInput min={0}>
                <NumberInputField
                  value={xrpReward}
                  onChange={(e) => setXrpReward(e.target.value)}
                  placeholder="XRP reward amount"
                />
              </NumberInput>
            </FormControl>

            <Button
              type="submit"
              colorScheme="orange"
              isLoading={isLoading}
              width="full"
            >
              Create Mission
            </Button>
          </VStack>
        </form>
      </CardBody>
    </Card>
  );
}; 