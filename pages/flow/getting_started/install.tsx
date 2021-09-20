import { Button, Popover, Typography } from "antd";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession, useSession } from "next-auth/client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { SessionWithToken } from "../../../types/session";
import { StyleMap } from "../../../types/style";
import { UserProgress, getCurrentProgress } from "../../../utils/progress";

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
  <div style={styles.ContentContainer}>
    <div style={styles.CTAContainer}>
      <Title level={4}>You are not signed in</Title>
    </div>
    <div style={styles.CTAContainer}>
      <Title level={4}>Please go back to the previous step</Title>
    </div>
    <div style={styles.ButtonsContainer}>
      <div style={styles.BackContainer}>
        <Link passHref href="/flow/getting_started/signup">
          <Button type="primary">Back</Button>
        </Link>
      </div>
      <div style={styles.NextContainer}>
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
  <div style={styles.ContentContainer}>
    <div style={styles.CTAContainer}>
      <Title level={5}>
        The second step is to install the github app onto either your account or
        organization and to give it access to the repositories you want
      </Title>
    </div>
    <div style={styles.CTAContainer}>
      <Title level={5}>
        The github app will look for qualifying markdown files in your
        repositories and sync their content with BLOGLOG
      </Title>
    </div>
    <div style={styles.CTAContainer}>
      <Title level={5}>
        For markdown files to qualify for BLOGLOG they need a title field as
        frontmatter
      </Title>
    </div>
    <div style={styles.CodeContainer}>
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
    <div style={styles.CTAContainer}>
      <Title level={5}>Markdown without this title field will be ignored</Title>
    </div>
    <div style={styles.CTAContainer}>
      <Title level={5}>
        For a simple working example repository fork this repository{" "}
        <Link passHref href="https://github.com/blog-log/example">
          here
        </Link>
      </Title>
    </div>
    <div style={styles.CTAContainer}>
      <Link
        key="installer"
        href={`https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_NAME}/installations/new`}
        passHref={true}
      >
        <Button type="primary">Install</Button>
      </Link>
    </div>
    <div style={styles.ButtonsContainer}>
      <div style={styles.BackContainer}></div>
      <div style={styles.NextContainer}>
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
  <div style={styles.ContentContainer}>
    <div style={styles.CTAContainer}>
      <Title level={4}>Hurray!!! You have installed the github app</Title>
    </div>
    <div style={styles.CTAContainer}>
      <Title level={4}>You are done</Title>
    </div>
    <div style={styles.ButtonsContainer}>
      <div style={styles.BackContainer}></div>
      <div style={styles.NextContainer}>
        <Link passHref href="/user">
          <Button type="primary">Profit</Button>
        </Link>
      </div>
    </div>
  </div>
);

const styles: StyleMap = {
  ContentContainer: {
    minHeight: "10rem",
    padding: "3rem",
    marginBottom: "3rem",
    background: "white",
  },
  CTAContainer: {
    margin: "3rem",
    textAlign: "center",
  },
  CodeContainer: {
    width: "60%",
    margin: "auto",
  },
  ButtonsContainer: {
    display: "flex",
  },
  BackContainer: {
    flex: 1,
    textAlign: "center",
  },
  NextContainer: {
    flex: 1,
    textAlign: "center",
  },
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const newProgress = await getCurrentProgress(session);

  return {
    props: { session, serverProgress: newProgress },
  };
};

export default Install;
