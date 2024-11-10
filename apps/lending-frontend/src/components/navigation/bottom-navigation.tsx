import { Flex, VStack, Text, Container, Box } from "@chakra-ui/react";
import { Home, Trophy, Star, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../shared/contexts/user-context";

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useUser();

  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: Trophy, label: isAdmin ? "Missions" : "Experience", path: isAdmin ? "/missions" : "/experience" },
    { icon: Star, label: "Leaderboard", path: "/leaderboard" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="white"
      borderTop="1px"
      borderColor="gray.200"
      py={4}
      zIndex={10}
    >
      <Container maxW="container.lg">
        <Flex justify="space-around" align="center">
          {navItems.map((item) => (
            <VStack
              key={item.path}
              spacing={1}
              color={location.pathname === item.path ? "orange.500" : "gray.600"}
              cursor="pointer"
              onClick={() => navigate(item.path)}
              _hover={{ color: "orange.500" }}
              transition="color 0.2s"
            >
              <item.icon size={24} />
              <Text fontSize="xs">{item.label}</Text>
            </VStack>
          ))}
        </Flex>
      </Container>
    </Box>
  );
}; 