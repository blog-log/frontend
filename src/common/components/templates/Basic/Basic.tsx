import { Layout, PageHeader } from "antd";
import router from "next/router";
import React from "react";
import Header from "../../elements/Header/Header";
import { StyleMap } from "../../../types/style";

const { Content, Footer } = Layout;

interface IProps {
  children: JSX.Element;
}

function Basic(props: IProps) {
  return (
    <Layout style={styles.Layout}>
      <Header />
      <Content style={styles.Content}>
        <div style={styles.ContentContainer}>{props.children}</div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
  );
}

export function BasicNoContentContainer(props: IProps) {
  return (
    <Layout style={styles.Layout}>
      <Header />
      <Content style={styles.Content}>{props.children}</Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©2018 Created by Ant UED
      </Footer>
    </Layout>
  );
}

export function BasicOnlyContent(props: IProps) {
  return (
    <Layout style={styles.Layout}>
      <PageHeader onBack={() => router.push("/")} title=" " />
      <Content style={styles.Content}>{props.children}</Content>
    </Layout>
  );
}

const styles: StyleMap = {
  Layout: {
    minHeight: "100vh",
  },
  Content: {
    padding: "3rem",
  },
  ContentContainer: {
    minHeight: "10rem",
    padding: "3rem",
    background: "white",
  },
};

export default Basic;
