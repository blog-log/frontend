import { Button, PageHeader, Avatar, Menu, Dropdown } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import getConfig from "next/config";

import SearchBar from "../SearchBar/SearchBar";
import { DeviceType } from "../../../utils/device";

const { publicRuntimeConfig } = getConfig();

interface IHeader {
  deviceType: DeviceType;
}

function Header(props: IHeader) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const loading = status === "loading";

  function handleBack() {
    router.push("/");
  }

  return (
    <PageHeader
      className="border-gray-400 bg-white"
      onBack={handleBack}
      backIcon={
        <HomeOutlined className="text-2xl leading-none place-items-center" />
      }
      title={props.deviceType === DeviceType.WEB ? "BLOGLOG" : null}
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
            <Dropdown
              key="dropdown"
              overlay={menu(session?.user?.name)}
              trigger={["click"]}
            >
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

export default Header;
