import { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";
import useSWR from "swr";
import { fetcher } from "../../api/fetcher";
import { logoutUser } from "../../api/auth";
import { useRouter } from "next/router";
import urlNextify from "../../utils/urlNextify";

const Links = [];

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
  >
    {children}
  </Link>
);

const UnauthenticatedComponent = ({ nextUrl }: { nextUrl: string }) => {
  return (
    <Stack direction="row" spacing={5}>
      <Button
        as={"a"}
        variant={"link"}
        href={`/auth/login${urlNextify(nextUrl)}`}
      >
        Sign In
      </Button>
      <Button
        variant={"solid"}
        colorScheme={"teal"}
        size={"sm"}
        as="a"
        href={`/auth/register${urlNextify(nextUrl)}`}
      >
        Register
      </Button>
    </Stack>
  );
};

const AuthenticatedComponent = ({}) => {
  const router = useRouter();
  const toast = useToast();

  return (
    <Flex alignItems={"center"}>
      <Menu>
        <MenuButton
          as={Button}
          rounded={"full"}
          variant={"link"}
          cursor={"pointer"}
          minW={0}
        >
          <Avatar
            size={"sm"}
            src={
              "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
            }
          />
        </MenuButton>
        <MenuList>
          <MenuItem>Link 1</MenuItem>
          <MenuItem>Link 2</MenuItem>
          <MenuDivider />
          <MenuItem
            onClick={async () => {
              await logoutUser();
              router.reload();
            }}
          >
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default function withAction() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { data, error } = useSWR("/base/user/me", fetcher);
  const isLoading = !data;
  const isAuthenticated = !!data?.user;

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <Box as="a" href="/">
              Indy
            </Box>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          {!isLoading && isAuthenticated && <AuthenticatedComponent />}
          {!isLoading && !isAuthenticated && (
            <UnauthenticatedComponent nextUrl={router.asPath} />
          )}
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
