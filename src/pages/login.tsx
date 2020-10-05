import * as React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { Box, Heading, Button, Link, Flex } from "@chakra-ui/core";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";

interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = ({}) => {
  const [, login] = useLoginMutation();
  const router = useRouter();
  return (
    <Wrapper variant="Large">
      <Box maxW="32rem" backgroundColor="#cfcfcf">
        <Formik
          initialValues={{ usernameOrEmail: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const user = await login({ params: values });
            if (user.data?.login.errors) {
              let newSchema = Yup.object().cast({
                [user.data.login.errors[0].target]:
                  user.data.login.errors[0].message,
              });
              if (newSchema) setErrors(newSchema);
            } else if (user.data?.login.user) {
              // worked
              if (typeof router.query.next === "string")
                router.push(router.query.next);
              router.push("/");
            }
          }}
          validationSchema={Yup.object({
            usernameOrEmail: Yup.string()
              .min(3, "Must be 3 or more characters!")
              .max(20, "Must be 20 characters or less!")
              .required("Required"),
            password: Yup.string()
              .min(3, "Must be 3 or more characters!")
              .max(20, "Must be 20 characters or less!")
              .required("Required"),
          })}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <Heading mb={3}>Login:</Heading>
              <InputField
                name="usernameOrEmail"
                label="Username / email"
                placeholder="Username or email!"
                mt="5px"
                touched={props.touched.usernameOrEmail}
              />
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                mt="5px"
                touched={props.touched.password}
                type="password"
              />
              <Flex>
                <NextLink href="/forgot-password">
                  <Link mt={2} ml={"auto"}>
                    forgot password?
                  </Link>
                </NextLink>
              </Flex>
              <Button
                isLoading={props.isSubmitting}
                size="lg"
                variantColor="teal"
                mt="24px"
                type="submit"
              >
                Login
              </Button>
            </form>
          )}
        </Formik>
      </Box>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(App);
