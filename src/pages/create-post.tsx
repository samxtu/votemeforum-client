import { Button, Flex, Heading } from "@chakra-ui/core";
import { Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";

const CreatePost = () => {
  useIsAuth();
  const router = useRouter();
  const [, createPost] = useCreatePostMutation();
  return (
    <Layout variant="Small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          console.log("submitted");
          const { error } = await createPost({ args: values });
          // worked
          if (!error) router.push("/");
        }}
        validationSchema={Yup.object({
          title: Yup.string().required("Required"),
          text: Yup.string().required("Required"),
        })}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <Heading mb={3}>Create post:</Heading>
            <InputField
              name="title"
              label="Post title"
              placeholder="Post title"
              mt="5px"
              touched={props.touched.title}
            />
            <InputField
              name="text"
              label="Post text"
              placeholder="text..."
              mt="5px"
              touched={props.touched.text}
              as="textarea"
              rows={3}
            />
            <Flex></Flex>
            <Button
              isLoading={props.isSubmitting}
              size="lg"
              variantColor="teal"
              mt="24px"
              type="submit"
            >
              Create post
            </Button>
          </form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);
