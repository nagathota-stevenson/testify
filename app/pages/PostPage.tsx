import React from "react";
import LoginCard from "../components/LoginCard";
import EditCard from "../components/EditCard";

const PostPage = () => {
  return (
    <section className="bg-blk1 w-screen h-screen flex items-center justify-center pt-24 pb-24">
      <EditCard docId={""} type={"request"} />
    </section>
  );
};

export default PostPage;
