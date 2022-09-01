import { ReactElement } from "react";
import LayoutWithNav from "../../components/base/LayoutWithNav";
import redirectIfNotAuth from "../../utils/redirectIfNotAuth";
import { NextPageWithLayout } from "../_app";

interface Props {}

const Schedule: NextPageWithLayout<Props> = ({}) => {
  redirectIfNotAuth();
  return <></>;
};

Schedule.getLayout = (page: ReactElement) => {
  return <LayoutWithNav>{page}</LayoutWithNav>;
};

export default Schedule;
