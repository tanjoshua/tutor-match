import {
  Box,
  Flex,
  Heading,
  LinkBox,
  LinkOverlay,
  Text,
} from "@chakra-ui/react";
import React from "react";

type Props = {
  id: string;
  invoiceNumber: number;
  title: string;
  state: string;
  total: number;
};

const InvoiceListItem = (props: Props) => {
  return (
    <LinkBox p={5} shadow={"md"} borderWidth={"1px"}>
      <Flex justifyContent={"space-between"}>
        <LinkOverlay href={`/invoicing/${props.id}`}>
          <Heading fontSize={"xl"}>{props.title}</Heading>
        </LinkOverlay>

        <Box>
          <Text fontWeight={"bold"}>{props.invoiceNumber}</Text>
        </Box>
      </Flex>
      <Text>${props.total}</Text>
      <Text>Payment by ...</Text>
    </LinkBox>
  );
};

export default InvoiceListItem;
