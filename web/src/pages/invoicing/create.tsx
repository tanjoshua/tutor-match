import React, { ReactElement } from "react";
import LayoutWithNav from "../../components/base/LayoutWithNav";

type Props = {};

const Create = (props: Props) => {
  return <div>Create</div>;
};

Create.getLayout = (page: ReactElement) => (
  <LayoutWithNav>{page}</LayoutWithNav>
);

export default Create;
