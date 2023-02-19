import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
import Layout from "../../components/Layout";

const BrowseTutors: NextPageWithLayout = () => {
  return <></>;
};

BrowseTutors.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default BrowseTutors;
