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
} from "@chakra-ui/react";
import { useState } from "react";
import { useUser } from "../../shared/contexts/user-context";
import { useNavigate } from "react-router-dom";

export const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { registerUser, login } = useUser();
    const toast = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isLogin) {
                await login(username, password);
                toast({
                    title: "Login successful!",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                await registerUser(username, password);
                toast({
                    title: "Account created successfully!",
                    description: "Your XRPL and EVM addresses have been generated.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            }
            navigate("/home");
        } catch (error) {
            toast({
                title: "Error",
                description: isLogin ? "Invalid username or password." : "Failed to create account. Please try again.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setUsername("");
        setPassword("");
    };

    return (
        <Box maxW="md" mx="auto" mt={8}>
            <VStack spacing={8} align="stretch">
                <Box textAlign="center">
                    <Heading size="xl" color="orange.500" mb={2}>
                        {isLogin ? "Welcome Back" : "Create Account"}
                    </Heading>
                    <Text color="gray.600">
                        {isLogin ? "Sign in to continue" : "Sign up to get started"}
                    </Text>
                </Box>

                <form onSubmit={handleSubmit}>
                    <VStack spacing={6}>
                        <FormControl isRequired>
                            <FormLabel>Username</FormLabel>
                            <Input
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                size="lg"
                                borderRadius="md"
                            />
                        </FormControl>

                        <FormControl isRequired>
                            <FormLabel>Password</FormLabel>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                size="lg"
                                borderRadius="md"
                            />
                        </FormControl>

                        <Button
                            type="submit"
                            colorScheme="orange"
                            size="lg"
                            width="full"
                            isLoading={isLoading}
                            loadingText={isLogin ? "Signing in..." : "Creating account..."}
                        >
                            {isLogin ? "Sign In" : "Create Account"}
                        </Button>

                        {!isLogin && (
                            <Text fontSize="sm" color="gray.600" textAlign="center">
                                By creating an account, XRPL and EVM addresses will be automatically generated.
                            </Text>
                        )}
                    </VStack>
                </form>

                <Flex justify="center" align="center" mt={4}>
                    <Text color="gray.600" mr={2}>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                    </Text>
                    <Button
                        variant="link"
                        color="orange.500"
                        onClick={toggleMode}
                    >
                        {isLogin ? "Sign Up" : "Sign In"}
                    </Button>
                </Flex>
            </VStack>
        </Box>
    );
}; 