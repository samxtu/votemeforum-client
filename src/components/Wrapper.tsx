import { Box } from "@chakra-ui/core";
import * as React from "react";
import { WrapperVariant } from "./Layout";

interface IWrapperProps {
  variant?: WrapperVariant;
}

export const Wrapper: React.FC<IWrapperProps> = ({
  variant = "Large",
  children,
}) => {
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
};
