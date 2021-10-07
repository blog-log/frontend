import { Button, PageHeader, Avatar, Menu, Dropdown } from "antd";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/client";
import getConfig from 'next/config'

import SearchBar from "./SearchBar";
import { SessionWithToken } from "../types/session";
import { StyleMap } from "../types/style";

const { publicRuntimeConfig } = getConfig()

function Header() {
  const router = useRouter();
  const [session, loading]: [SessionWithToken | null, boolean] = useSession();

  function handleBack() {
    router.push("/");
  }

  return (
    <PageHeader
      style={styles.Header}
      onBack={handleBack}
      title="BLOGLOG"
      extra={[
        <SearchBar key="searcher" />,
        (!session || session?.error === "RefreshAccessTokenError") && (
          <Button key="signin" onClick={() => signIn()}>
            Sign In
          </Button>
        ),
        session &&
          session?.error !== "RefreshAccessTokenError" &&
          session?.user?.name && (
            <Dropdown key="dropdown" overlay={menu(session?.user?.name)} trigger={["click"]}>
              <Avatar key="avatar" src={session.user?.image} />
            </Dropdown>
          ),
      ]}
    />
  );
}

const menu = (name: string) => (
  <Menu>
    <Menu.Item key="0">
      <Link key="0-link" href="/user">
        {name}
      </Link>
    </Menu.Item>
    <Menu.Divider key="1" />
    <Menu.Item key="2" onClick={() => signOut()}>
      Sign Out
    </Menu.Item>
    <Menu.Item key="3">
      <Link
        key="installer"
        href={`https://github.com/apps/${publicRuntimeConfig.NEXT_PUBLIC_GITHUB_APP_NAME}/installations/new`}
        passHref={true}
      >
        Install
      </Link>
    </Menu.Item>
  </Menu>
);

const styles: StyleMap = {
  Header: {
    border: "1px solid rgb(235, 237, 240)",
    background: "white",
  },
};

export default Header;
