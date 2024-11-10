import { Box } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const AppLayout: FC<Props> = ({ children }) => {
  return (
      <Box as="main" py={8}>
        {children}
      </Box>
  );
};
