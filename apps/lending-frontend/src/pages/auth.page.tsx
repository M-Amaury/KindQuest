import { Box, Container, Heading, VStack } from "@chakra-ui/react";
import { AuthForm } from "../components/auth/auth-form";

export const AuthPage = () => {
    return (
        <Box minH="100vh" bg="gray.50">
            <Container maxW="container.lg" py={8}>
                <VStack spacing={8}>
                    <Box textAlign="center">
                        <Heading 
                            as="h1" 
                            size="2xl" 
                            color="orange.500"
                            letterSpacing="tight"
                        >
                            KindQuest
                        </Heading>
                    </Box>
                    <AuthForm />
                </VStack>
            </Container>
        </Box>
    );
}; 