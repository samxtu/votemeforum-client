import { Flex, IconButton, Text } from "@chakra-ui/core";
import * as React from "react";
import { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

export interface IUpdootPostProps {
  post: PostSnippetFragment;
}

export const UpdootPost = (props: IUpdootPostProps) => {
  const { id, points, voteStatus } = props.post;
  const [, vote] = useVoteMutation();
  const [loadingState, setLoadingState] = useState<
    "not-loading" | "downloading" | "uploading"
  >("not-loading");
  return (
    <Flex
      direction="column"
      mr={4}
      align="center"
      alignContent="center"
      alignItems="center"
    >
      <IconButton
        onClick={async () => {
          if (voteStatus === 1) return;
          setLoadingState("uploading");
          await vote({
            value: 1,
            postId: id,
          });
          setLoadingState("not-loading");
        }}
        variantColor={voteStatus === 1 ? "green" : undefined}
        isLoading={loadingState === "uploading"}
        aria-label="up vote"
        icon="chevron-up"
      />
      <Text>{points}</Text>
      <IconButton
        onClick={async () => {
          if (voteStatus === -1) return;
          setLoadingState("downloading");
          await vote({
            value: -1,
            postId: id,
          });
          setLoadingState("not-loading");
        }}
        variantColor={voteStatus === -1 ? "red" : undefined}
        isLoading={loadingState === "downloading"}
        aria-label="down vote"
        icon="chevron-down"
      />
    </Flex>
  );
};
