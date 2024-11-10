import {
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    useToast,
    Text,
    Box,
    Flex,
    Heading,
    SimpleGrid,
    Progress,
} from "@chakra-ui/react";
import { useState } from "react";
import { useUser } from "../../shared/contexts/user-context";
import { Home, Trophy, Star, Settings } from "lucide-react";

interface WeekProgress {
    week: number;
    points: number;
}

export const RegisterForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { registerUser } = useUser();
    const toast = useToast();

    const weeklyProgress: WeekProgress[] = [
        { week: 1, points: 4 },
        { week: 2, points: 16 },
        { week: 3, points: 8 },
        { week: 4, points: 25 },
        { week: 5, points: 4 },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await registerUser(username, password);
            toast({
                title: "Account created successfully!",
                description: "Your XRPL and EVM addresses have been generated.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create account. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box maxW="md" mx="auto" bg="white" minH="100vh" position="relative" pb="80px">
            <Box p={4}>
                {/* Header */}
                <Flex justify="space-between" align="center" mb={6}>
                    <Box>
                        <Heading size="md" color="orange.500">Exchange your KIND</Heading>
                        <Text fontSize="xl" fontWeight="bold">765 KIND</Text>
                    </Box>
                    <Avatar h="12" w="12">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>KV</AvatarFallback>
                    </Avatar>
                </Flex>

                {/* Weekly Progress */}
                <Box mt={4} p={4} bg="white" rounded="lg" shadow="sm">
                    <SimpleGrid columns={5} spacing={4} mb={2}>
                        {weeklyProgress.map((week, index) => (
                            <VStack key={index} spacing={1}>
                                <Text fontSize="xs" color="gray.600">Week {week.week}</Text>
                                <Text fontSize="sm" fontWeight="medium">+{week.points}</Text>
                            </VStack>
                        ))}
                    </SimpleGrid>
                    <Progress value={60} size="sm" colorScheme="orange" />
                </Box>

                {/* Registration Form */}
                <Box mt={8}>
                    <form onSubmit={handleSubmit}>
                        <VStack spacing={4} align="stretch">
                            <FormControl isRequired>
                                <FormLabel>Username</FormLabel>
                                <Input
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Password</FormLabel>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                />
                            </FormControl>

                            <Button
                                type="submit"
                                colorScheme="orange"
                                isLoading={isLoading}
                                loadingText="Creating account..."
                            >
                                Create Account
                            </Button>

                            <Text fontSize="sm" color="gray.600" textAlign="center">
                                By creating an account, XRPL and EVM addresses will be automatically generated and linked to your username.
                            </Text>
                        </VStack>
                    </form>
                </Box>
            </Box>

            {/* Bottom Navigation */}
            <Flex
                position="fixed"
                bottom={0}
                left={0}
                right={0}
                bg="white"
                borderTop="1px"
                borderColor="gray.200"
                justify="space-around"
                p={4}
                maxW="md"
                mx="auto"
                zIndex={10}
            >
                <VStack spacing={1} color="gray.600">
                    <Home size={24} />
                    <Text fontSize="xs">Mission</Text>
                </VStack>
                <VStack spacing={1} color="gray.600">
                    <Trophy size={24} />
                    <Text fontSize="xs">Leaderboard</Text>
                </VStack>
                <VStack spacing={1} color="gray.600">
                    <Star size={24} />
                    <Text fontSize="xs">Experience</Text>
                </VStack>
                <VStack spacing={1} color="gray.600">
                    <Settings size={24} />
                    <Text fontSize="xs">Settings</Text>
                </VStack>
            </Flex>
        </Box>
    );
}; 