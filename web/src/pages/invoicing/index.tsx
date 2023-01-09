import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ReactElement, useEffect, useState } from "react";
import LayoutWithNav from "../../components/base/LayoutWithNav";
import { Select } from "chakra-react-select";
import useSWRInfinite from "swr/infinite";
import _, { debounce } from "lodash";

import { fetcher } from "../../api/fetcher";
import InvoiceListItem from "../../components/invoicing/InvoiceListItem";

type Props = {};
const invoiceStateOptions = [
  { label: "Draft", value: "Draft" },
  { label: "Pending Payment", value: "Pending Payment" },
  { label: "Payment Received", value: "Payment Received" },
];
const PAGE_SIZE = 4;

const Invoicing = (props: Props) => {
  const [invoiceStateFilter, setInvoiceStateFilter] = useState(null);
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState("");
  const [debouncedInvoiceSearchQuery, setDebouncedInvoiceSearchQuery] =
    useState("");
  const { data, error, size, setSize, isValidating } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (invoiceSearchQuery != debouncedInvoiceSearchQuery) {
        // DO NOT FETCH if debounced value not updated
        return null;
      }

      let key = `/invoicing?page=${pageIndex + 1}&limit=${PAGE_SIZE}`;
      if (invoiceStateFilter) {
        key += `&state=${invoiceStateFilter.value}`;
      }
      if (invoiceSearchQuery) {
        key += `&search=${debouncedInvoiceSearchQuery}`;
      }

      return key;
    },
    fetcher
  );

  const debouncedUpdate = _.debounce(
    (value) => setDebouncedInvoiceSearchQuery(value),
    300
  );

  const isLoadingInitialInvoices = !data && !error;
  const isEmpty = data?.[0]?.length === 0;
  const isEnd =
    isEmpty || (data && data[data.length - 1].invoices?.length < PAGE_SIZE);
  const isRefreshing = isValidating && data && data.length === size;

  // combine invoices from all pages
  const invoices = data
    ? data.reduce(
        (accumulator, value) => accumulator.concat(value.invoices),
        []
      )
    : [];

  return (
    <Flex flexDirection={"row"}>
      <Box flex={3}>
        <Stack>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input
              value={invoiceSearchQuery}
              onChange={(e) => {
                setInvoiceSearchQuery(e.target.value);
                debouncedUpdate(e.target.value);
              }}
            />
          </InputGroup>
          <Box w={256}>
            <Select
              options={invoiceStateOptions}
              placeholder="Invoice State"
              isClearable
              value={invoiceStateFilter}
              onChange={(newValue) => {
                setInvoiceStateFilter(newValue);
              }}
            />
          </Box>
          {!isLoadingInitialInvoices &&
            invoices.map((invoice) => (
              <InvoiceListItem
                key={invoice.id}
                id={invoice.id}
                invoiceNumber={invoice.invoiceNumber}
                state={invoice.state}
                total={invoice.total}
                title={invoice.title}
              />
            ))}
          {isEmpty && <Text>No invoices found</Text>}
          {!isEmpty && isEnd ? (
            <Text>No more invoices</Text>
          ) : (
            <Button
              isLoading={isLoadingInitialInvoices || isRefreshing}
              onClick={() => setSize(size + 1)}
            >
              Load more
            </Button>
          )}
        </Stack>
      </Box>
      <Box flex={2} marginLeft={5}>
        <Stack>
          <Button />
        </Stack>
      </Box>
    </Flex>
  );
};

Invoicing.getLayout = (page: ReactElement) => (
  <LayoutWithNav>{page}</LayoutWithNav>
);

export default Invoicing;
