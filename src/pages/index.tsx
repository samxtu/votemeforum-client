import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { PostSnippetFragment, usePostsQuery } from "../generated/graphql";
import { Layout } from "../components/Layout";
import React from "react";
import NextLink from "next/link";
import { Stack, Box, Heading, Text, Flex, Link, Button } from "@chakra-ui/core";
import { useState } from "react";
import { UpdootPost } from "../components/UpdootPost";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | number,
  });
  const [{ data, fetching }] = usePostsQuery({ variables });
  return (
    <Layout>
      <Flex pb={8} align="center">
        <Heading>VoteMeForum</Heading>
        <NextLink href="/create-post">
          <Link ml="auto">Create post</Link>
        </NextLink>
      </Flex>
      {fetching ? (
        <>
          <Text>Loading ... </Text>
        </>
      ) : null}
      {!fetching && data && data?.posts.posts.length > 0 ? (
        <Stack spacing={8}>
          {data?.posts.posts.map((post: PostSnippetFragment) => (
            <Flex p={5} shadow="md" borderWidth="1px" key={post.id}>
              <UpdootPost post={post} />
              <Box>
                <Heading fontSize="xl">{post.title}</Heading>
                <Text>posted by {post.creator.username}</Text>
                <Text mt={4}>{post.textSnippet}</Text>
              </Box>
            </Flex>
          ))}
        </Stack>
      ) : null}
      <Flex>
        {!fetching && data && data?.posts.hasMore ? (
          <Button
            onClick={() => {
              setVariables({
                limit: 10,
                cursor: data?.posts.posts[data.posts.posts.length - 1].id,
              });
            }}
            m="auto"
            my={5}
          >
            Load more
          </Button>
        ) : null}
      </Flex>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Index);
