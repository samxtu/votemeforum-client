import { dedupExchange, fetchExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { GRAPHQL_ORIGIN } from "../constants";
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation,
  ResetPasswordMutation,
} from "../generated/graphql";
import betterUpdateQuery from "./betterUpdateQuery";

export const createUrqlClient = (ssrExchange: any) => ({
  url: GRAPHQL_ORIGIN,
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
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
    fetchExchange,
  ],
});
