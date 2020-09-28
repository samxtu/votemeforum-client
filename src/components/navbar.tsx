import { Box, Button, Flex, Link } from "@chakra-ui/core";
import * as React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { IS_SERVER } from "../constants";

export interface IAppProps {}

export default function App({}) {
  const [{ data }] = useMeQuery({
    pause: IS_SERVER,
  });
  const [{ fetching }, logoutMutant] = useLogoutMutation();
  let body = null;
  if (!data?.me) {
    body = (
      <Box ml={"auto"}>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </Box>
    );
  } else if (data?.me) {
    body = (
      <Flex ml={"auto"}>
        <Box>{data.me.username}</Box>
        <Button
          variant="link"
          ml={2}
          isLoading={fetching}
          onClick={() => {
            logoutMutant();
          }}
        >
          Logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex bg="tan" p={4}>
      {body}
    </Flex>
  );
}
