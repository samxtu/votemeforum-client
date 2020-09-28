import Navbar from "../components/navbar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <>
      <Navbar />
      <h1>Hello!!</h1>
      {data?.posts.map((post) => (
        <h4 key={post.id}>
          On {post.createdAt}: {post.title}
        </h4>
      ))}
    </>
  );
};

export default withUrqlClient(createUrqlClient)(Index);
