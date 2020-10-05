import * as React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { Box, Heading, Button, useToast } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { InputField } from "../components/InputField";
import {Wrapper} from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { useState } from "react";

const ForgotPassword = () => {
  const [, forgotPassword] = useForgotPasswordMutation();
  const [complete, setComplete] = useState(false);
  const toast = useToast();
  return (
    <Wrapper variant="Large">
      <Box maxW="32rem" backgroundColor="#cfcfcf">
        {complete ? (
          <Box>Check your emails!!!</Box>
        ) : (
          <Formik
            initialValues={{ email: "" }}
            onSubmit={async (values) => {
              await forgotPassword({ email: values.email });
              setComplete(true);
              toast({
                title: "Email sent.",
                description: "Check emails to reset your password.",
                status: "success",
                duration: 10000,
                isClosable: true,
              });
            }}
            validationSchema={Yup.object({
              email: Yup.string()
                .email("Invalid email address.")
                .required("Required"),
            })}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit}>
                <Heading mb={3}>Forgot password:</Heading>
                <InputField
                  name="email"
                  placeholder="Your email"
                  mt="5px"
                  touched={props.touched.email}
                />
                <Button
                  isLoading={props.isSubmitting}
                  size="lg"
                  variantColor="teal"
                  mt="24px"
                  type="submit"
                >
                  Reset password
                </Button>
              </form>
            )}
          </Formik>
        )}
      </Box>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
