import * as React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { Box, Heading, Button } from "@chakra-ui/core";
import Wrapper from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";

interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = ({}) => {
  const [, register] = useRegisterMutation();
  const router = useRouter();
  return (
    <Wrapper variant="Large">
      <Box maxW="32rem" backgroundColor="#cfcfcf">
        <Formik
          initialValues={{ username: "", email: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const data = await register({ params: values });
            if (data.data?.register.errors) {
              let newSchema = Yup.object().cast({
                [data.data.register.errors[0].target]:
                  data.data.register.errors[0].message,
              });
              if (newSchema) setErrors(newSchema);
            } else if (data.data?.register.user) {
              // worked
              router.push("/");
            }
          }}
          validationSchema={Yup.object({
            username: Yup.string()
              .min(3, "Must be 3 or more characters!")
              .max(15, "Must be 15 characters or less!")
              .required("Required"),
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            password: Yup.string()
              .min(3, "Must be 3 or more characters!")
              .max(20, "Must be 20 characters or less!")
              .required("Required"),
          })}
        >
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <Heading mb={3}>Register:</Heading>
              <InputField
                name="username"
                mt="5px"
                touched={props.touched.username}
              />
              <InputField name="email" mt="5px" touched={props.touched.email} />
              <InputField
                name="password"
                mt="5px"
                touched={props.touched.password}
                type="password"
              />
              <Button
                isLoading={props.isSubmitting}
                size="lg"
                variantColor="teal"
                mt="24px"
                type="submit"
              >
                Register
              </Button>
            </form>
          )}
        </Formik>
      </Box>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(App);
