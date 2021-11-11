import { Button, Popover, Typography } from "antd";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession, useSession } from "next-auth/client";
import Link from "next/link";
import getConfig from "next/config";
import React, { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { SessionWithToken } from "../../../common/types/session";
import {
  UserProgress,
  getCurrentProgress,
} from "../../../common/utils/progress";

const { publicRuntimeConfig } = getConfig();

const { Title } = Typography;

interface IInstall {
  serverProgress: UserProgress;
  session: Session | null;
}

function Install(props: IInstall) {
  const [progress, setProgress] = useState<UserProgress>(props.serverProgress);
  const [session]: [SessionWithToken | null, boolean] = useSession();

  useEffect(() => {
    async function getProgress() {
      const newProgress = await getCurrentProgress(session);
      setProgress(newProgress);
    }
    getProgress();
  }, [session]);

  return (
    <>
      {progress === UserProgress.Initial && <NotReady />}
      {progress === UserProgress.SignedUp && <Ready />}
      {progress === UserProgress.Done && <Completed />}
    </>
  );
}

const NotReady = () => (
  <div className="bg-white p-3 md:p-8 mb-4 md:mb-8 lg:mb-12">
    <div className="text-center w-full md:w-7/12 m-auto mb-4 md:mb-8 lg:mb-12">
      <Title level={4}>You are not signed in</Title>
    </div>
    <div className="text-center w-full md:w-7/12 m-auto mb-4 md:mb-8 lg:mb-12">
      <Title level={4}>Please go back to the previous step</Title>
    </div>
    <div className="flex">
      <div className="flex-1 text-center">
        <Link passHref href="/flow/getting_started/signup">
          <Button type="primary">Back</Button>
        </Link>
      </div>
      <div className="flex-1 text-center">
        {/* fake button does not do anything */}
        <Popover content="you have not installed the github app">
          <Button disabled type="primary">
            Profit
          </Button>
        </Popover>
      </div>
    </div>
  </div>
);

const Ready = () => (
  <div className="bg-white p-3 md:p-8 mb-4 md:mb-8 lg:mb-12">
    <div className="text-center w-full md:w-7/12 m-auto mb-4 md:mb-8 lg:mb-12">
      <Title level={5}>
        The second step is to install the github app onto either your account or
        organization and to give it access to the repositories you want
      </Title>
    </div>
    <div className="text-center w-full md:w-7/12 m-auto mb-4 md:mb-8 lg:mb-12">
      <Title level={5}>
        The github app will look for qualifying markdown files in your
        repositories and sync their content with BLOGLOG
      </Title>
    </div>
    <div className="text-center w-full md:w-7/12 m-auto mb-4 md:mb-8 lg:mb-12">
      <Title level={5}>
        For markdown files to qualify for BLOGLOG they need a title field as
        frontmatter
      </Title>
    </div>
    <div className="text-center w-full md:w-7/12 m-auto mb-4 md:mb-8 lg:mb-12">
      <Title level={5}>Example</Title>
      <SyntaxHighlighter language="markdown">
        {`---
title: This is an example title
---
### More markdown content
...
`}
      </SyntaxHighlighter>
    </div>
    <div className="text-center w-full md:w-7/12 m-auto mb-4 md:mb-8 lg:mb-12">
      <Title level={5}>Markdown without this title field will be ignored</Title>
    </div>
    <div className="text-center w-full md:w-7/12 m-auto mb-4 md:mb-8 lg:mb-12">
      <Title level={5}>
        For a simple working example repository fork this repository{" "}
        <Link passHref href="https://github.com/blog-log/example">
          here
        </Link>
      </Title>
    </div>
    <div className="text-center w-full md:w-7/12 m-auto mb-4 md:mb-8 lg:mb-12">
      <Link
        key="installer"
        href={`https://github.com/apps/${publicRuntimeConfig.NEXT_PUBLIC_GITHUB_APP_NAME}/installations/new`}
        passHref={true}
      >
        <Button type="primary">Install</Button>
      </Link>
    </div>
    <div className="flex">
      <div className="flex-1 text-center"></div>
      <div className="flex-1 text-center">
        {/* fake button does not do anything */}
        <Popover content="you have not installed the github app">
          <Button disabled type="primary">
            Profit
          </Button>
        </Popover>
      </div>
    </div>
  </div>
);

const Completed = () => (
  <div className="bg-white p-3 md:p-8 mb-4 md:mb-8 lg:mb-12">
    <div className="text-center w-full md:w-7/12 m-auto mb-4 md:mb-8 lg:mb-12">
      <Title level={4}>Hurray!!! You have installed the github app</Title>
    </div>
    <div className="text-center w-full md:w-7/12 m-auto mb-4 md:mb-8 lg:mb-12">
      <Title level={4}>You are done</Title>
    </div>
    <div className="flex">
      <div className="flex-1 text-center"></div>
      <div className="flex-1 text-center">
        <Link passHref href="/user">
          <Button type="primary">Profit</Button>
        </Link>
      </div>
    </div>
  </div>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const newProgress = await getCurrentProgress(session);

  return {
    props: { session, serverProgress: newProgress },
  };
};

export default Install;
