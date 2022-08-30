import { ReactElement } from "react";
import { Text, Box } from "@chakra-ui/react";
import LayoutWithNav from "../../components/base/LayoutWithNav";
import { NextPageWithLayout } from "../_app";

interface Props {}

const Login: NextPageWithLayout<Props> = ({}) => {
  return (
    <>
      <Text>login</Text>
    </>
  );
};

Login.getLayout = (page: ReactElement) => {
  return <LayoutWithNav>{page}</LayoutWithNav>;
};

export default Login;
