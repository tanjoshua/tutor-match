import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
import Layout from "../../components/Layout";

const TutorRequest: NextPageWithLayout = () => {
  return <></>;
};

TutorRequest.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default TutorRequest;
