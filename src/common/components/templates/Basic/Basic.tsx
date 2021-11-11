import { Layout, PageHeader } from "antd";
import router from "next/router";
import Head from "next/head";
import React from "react";
import Header from "../../elements/Header/Header";
import { StyleMap } from "../../../types/style";
import { DeviceType } from "../../../utils/device";

const { Content, Footer } = Layout;

interface IProps {
  deviceType: DeviceType;
  children: JSX.Element;
}

function Basic(props: IProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        ></meta>
      </Head>
      <Layout style={styles.Layout}>
        <Header deviceType={props.deviceType} />
        <Content className="p-2 md:p-6 lg:p-12">
          <div style={styles.ContentContainer}>{props.children}</div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </>
  );
}

export function BasicNoContentContainer(props: IProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        ></meta>
      </Head>
      <Layout style={styles.Layout}>
        <Header deviceType={props.deviceType} />
        <Content className="p-2 md:p-6 lg:p-12">{props.children}</Content>
        <Footer style={{ textAlign: "center" }}>
          Ant Design ©2018 Created by Ant UED
        </Footer>
      </Layout>
    </>
  );
}

export function BasicOnlyContent(props: IProps) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        ></meta>
      </Head>
      <Layout style={styles.Layout}>
        <PageHeader onBack={() => router.push("/")} title=" " />
        <Content className="p-2 md:p-6 lg:p-12">{props.children}</Content>
      </Layout>
    </>
  );
}

const styles: StyleMap = {
  Layout: {
    minHeight: "100vh",
  },
  ContentContainer: {
    minHeight: "10rem",
    padding: "3rem",
    background: "white",
  },
};

export default Basic;
