import { NextPageWithLayout } from "./_app";
import { ReactElement } from "react";
import Layout from "../components/Layout";

const About: NextPageWithLayout = () => {
  return <></>;
};

About.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default About;
