import { Box } from "@chakra-ui/core";
import * as React from "react";

interface IAppProps {
  variant?: "Small" | "Medium" | "Large";
  children: JSX.Element;
}

export default function App({ variant = "Large", children }: IAppProps) {
  return (
    <Box
      maxW={
        variant === "Large" ? "800px" : variant === "Medium" ? "600px" : "400px"
      }
      w="100%"
      mt={4}
      mx="auto"
    >
      {children}
    </Box>
  );
}
