import { Layout, PageHeader } from "antd";
import router from "next/router";
import Head from "next/head";
import React from "react";
import Header from "../../elements/Header/Header";
import { DeviceType } from "../../../utils/device";

const { Content } = Layout;

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
      <Layout className="min-h-screen">
        <Header deviceType={props.deviceType} />
        <Content className="p-2 md:p-6 lg:p-12">
          <div className="bg-white p-1 md:p-8 mb-2 md:mb-8 lg:mb-12">
            {props.children}
          </div>
        </Content>
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
      <Layout className="min-h-screen">
        <Header deviceType={props.deviceType} />
        <Content className="p-2 md:p-6 lg:p-12">{props.children}</Content>
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
      <Layout className="min-h-screen">
        {props.deviceType === DeviceType.WEB && (
          <PageHeader
            className="pt-4 pb-0 pr-6 pl-6"
            onBack={() => router.push("/")}
            title=" "
          />
        )}
        <Content className="p-2 md:p-4">{props.children}</Content>
      </Layout>
    </>
  );
}

export default Basic;
