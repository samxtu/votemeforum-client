import { dedupExchange, fetchExchange, stringifyVariables } from "urql";
import { cacheExchange, Resolver } from "@urql/exchange-graphcache";
import { GRAPHQL_ORIGIN } from "../constants";
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation,
  ResetPasswordMutation,
  VoteMutationVariables,
} from "../generated/graphql";
import betterUpdateQuery from "./betterUpdateQuery";
import { pipe, tap } from "wonka";
import { Exchange } from "urql";
import Router from "next/router";
import gql from "graphql-tag";

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      // If the OperationResult has an error send a request to sentry
      if (error?.message.includes("not authenticated")) {
        Router.replace("/login");
      }
    })
  );
};

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) return undefined;
    let hasMore = true;
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const IsItInCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      "posts"
    );
    info.partial = !IsItInCache;
    const results: string[] = [];
    fieldInfos.forEach((fi) => {
      const data = cache.resolve(
        cache.resolveFieldByKey(entityKey, fi.fieldKey) as string,
        "posts"
      ) as string[];
      const _hasMore = cache.resolve(
        cache.resolveFieldByKey(entityKey, fi.fieldKey) as string,
        "hasMore"
      ) as boolean;
      if (!_hasMore) hasMore = _hasMore;
      results.push(...data);
    });
    return {
      __typename: "PaginatedPosts",
      hasMore,
      posts: results,
    };
  };
};

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  return {
    url: GRAPHQL_ORIGIN,
    fetchOptions: {
      credentials: "include" as const,
      headers: {
        cookie:
          ctx && ctx.req.headers.cookie ? ctx.req.headers.cookie : undefined,
      },
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          PaginatedPosts: () => null,
        },
        resolvers: {
          Query: {
            posts: cursorPagination(),
          },
        },
        updates: {
          Mutation: {
            //vote
            vote: (_result, args, cache, info) => {
              const { postId, value } = args as VoteMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment _ on Post {
                    id
                    points
                    voteStatus
                  }
                `,
                { id: postId } as any
              ); // Data or null
              if (data) {
                if (data.voteStatus === value) return;
                const newPoints =
                  (data.points as number) + (data.voteStatus ? 2 : 1) * value;
                cache.writeFragment(
                  gql`
                    fragment __ on Post {
                      points
                      voteStatus
                    }
                  `,
                  { id: postId, points: newPoints, voteStatus: value } as any
                );
              }
            },
            //create post
            createPost: (_result, args, cache, info) => {
              const allFields = cache.inspectFields("Query");
              const fieldInfos = allFields.filter(
                (info) => info.fieldName === "posts"
              );
              fieldInfos.forEach((fi) => {
                cache.invalidate("Query", "posts", fi.arguments || {});
              });
            },
            //login update
            login: (_result, args, cache, info) => {
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.login.errors) return query;
                  else return { me: result.login.user };
                }
              );
            },
            //logout update
            logout: (_result, args, cache, info) => {
              betterUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => {
                  return { me: null };
                }
              );
            },
            //reset password update
            resetPassword: (_result, args, cache, info) => {
              betterUpdateQuery<ResetPasswordMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.resetPassword.errors) return query;
                  else return { me: result.resetPassword.user };
                }
              );
            },
            //register update
            register: (_result, args, cache, info) => {
              betterUpdateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.register.errors) return query;
                  else return { me: result.register.user };
                }
              );
            },
          },
        },
      }),
      ssrExchange,
      errorExchange,
      fetchExchange,
    ],
  };
};
