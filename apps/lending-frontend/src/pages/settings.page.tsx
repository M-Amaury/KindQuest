import { Box, Container, Heading, VStack, FormControl, FormLabel, Input, Switch, Button, Divider, useToast, Text } from "@chakra-ui/react";
import { BottomNavigation } from "../components/navigation/bottom-navigation";
import { useUser } from "../shared/contexts/user-context";
import { useState } from "react";

export const SettingsPage = () => {
  const { user, logout } = useUser();
  const toast = useToast();
  const [notifications, setNotifications] = useState(true);
  const [email, setEmail] = useState("");

  const handleSave = () => {
    toast({
      title: "Settings saved",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box pb="80px">
      <Container maxW="container.lg">
        <VStack spacing={8} align="stretch">
          <Heading color="orange.500" size="lg">Settings</Heading>

          {/* Account Information */}
          <VStack spacing={4} align="stretch" bg="white" p={6} borderRadius="lg" shadow="sm">
            <Heading size="md" color="gray.700">Account Information</Heading>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Input value={user?.username} isReadOnly bg="gray.50" />
            </FormControl>
            <FormControl>
              <FormLabel>XRPL Address</FormLabel>
              <Input value={user?.xrplAddress} isReadOnly bg="gray.50" />
            </FormControl>
            <FormControl>
              <FormLabel>EVM Address</FormLabel>
              <Input value={user?.evmAddress} isReadOnly bg="gray.50" />
            </FormControl>
          </VStack>

          {/* Preferences */}
          <VStack spacing={4} align="stretch" bg="white" p={6} borderRadius="lg" shadow="sm">
            <Heading size="md" color="gray.700">Preferences</Heading>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">Enable Notifications</FormLabel>
              <Switch 
                colorScheme="orange" 
                isChecked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Email for Notifications</FormLabel>
              <Input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </FormControl>
          </VStack>

          {/* Actions */}
          <VStack spacing={4} align="stretch" bg="white" p={6} borderRadius="lg" shadow="sm">
            <Heading size="md" color="gray.700">Actions</Heading>
            <Button colorScheme="orange" onClick={handleSave}>
              Save Changes
            </Button>
            <Divider />
            <Button variant="outline" colorScheme="red" onClick={logout}>
              Logout
            </Button>
          </VStack>

          {/* App Info */}
          <VStack spacing={2} align="stretch" bg="white" p={6} borderRadius="lg" shadow="sm">
            <Heading size="md" color="gray.700">About</Heading>
            <Text color="gray.600">Version 1.0.0</Text>
            <Text color="gray.600">© 2024 KindQuest. All rights reserved.</Text>
          </VStack>
        </VStack>
      </Container>
      <BottomNavigation />
    </Box>
  );
}; 