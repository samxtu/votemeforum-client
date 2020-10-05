import { NextPage } from "next";
import * as Yup from "yup";
import { Formik } from "formik";
import { Box, Heading, Button, Flex, Link } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import React from "react";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { InputField } from "../../components/InputField";
import { Wrapper } from "../../components/Wrapper";
import { useResetPasswordMutation } from "../../generated/graphql";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { useState } from "react";

const ResetPassword: NextPage = () => {
  const router = useRouter();
  const [, resetPassword] = useResetPasswordMutation();
  const [error, setError] = useState({
    target: "",
    message: "",
  });
  return (
    <Wrapper variant="Large">
      <Box maxW="32rem" backgroundColor="#cfcfcf">
        <Formik
          initialValues={{ newPassword: "", repeatPassword: "" }}
          onSubmit={async (values, { setErrors }) => {
            if (values.newPassword !== values.repeatPassword) {
              let errorSchema = Yup.object().cast({
                repeatPassword: "Passwords do not match!",
                newPassword: "Passwords do not match!",
              });
              if (errorSchema) setErrors(errorSchema);
              return false;
            }
            const user = await resetPassword({
              newPassword: values.newPassword,
              token:
                typeof router.query.token === "string"
                  ? router.query.token
                  : "",
            });
            if (user.data?.resetPassword.errors) {
              setError(user.data.resetPassword.errors[0]);
            } else if (user.data?.resetPassword.user) {
              // worked
              router.push("/");
            }
            return false;
          }}
          validationSchema={Yup.object({
            newPassword: Yup.string()
              .min(3, "Must be 3 or more characters!")
              .max(20, "Must be 20 characters or less!")
              .required("Required"),
            repeatPassword: Yup.string()
              .min(3, "Must be 3 or more characters!")
              .max(20, "Must be 20 characters or less!")
              .required("Required"),
          })}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <Heading mb={3}>Reset password:</Heading>
              <InputField
                label="New password"
                name="newPassword"
                placeholder="New password"
                mt="5px"
                touched={props.touched.newPassword}
                type="password"
              />
              <InputField
                label="Repeat new password"
                name="repeatPassword"
                placeholder="repeat password"
                mt="5px"
                touched={props.touched.repeatPassword}
                type="password"
              />
              {error ? (
                error.target === "Token" ? (
                  <Flex color="red">
                    Token expired!{" "}
                    <NextLink href="/forgot-password">
                      <Link>go get a new one!</Link>
                    </NextLink>{" "}
                  </Flex>
                ) : (
                  <Box color="red">
                    {error.target}:{error.message}
                  </Box>
                )
              ) : null}
              <Button
                isLoading={props.isSubmitting}
                size="lg"
                variantColor="teal"
                mt="24px"
                type="submit"
              >
                Confirm password change
              </Button>
            </form>
          )}
        </Formik>
      </Box>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ResetPassword);
