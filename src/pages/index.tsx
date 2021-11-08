/* eslint-disable react/no-children-prop */
import Image from "next/image";
import TextLoop from "react-text-loop";
import { Button, Typography, Steps, Divider } from "antd";
import { StyleMap } from "../common/types/style";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getSession, useSession } from "next-auth/client";
import { SessionWithToken } from "../common/types/session";
import { useRouter } from "next/router";
import { getCurrentProgress, UserProgress } from "../common/utils/progress";
import { GetServerSideProps } from "next";

const { Title } = Typography;
const { Step } = Steps;

interface IHome {
  serverProgress: UserProgress;
}

function Home(props: IHome) {
  return (
    <>
      <div style={styles.ContentContainer}>
        <div style={styles.CTAContainer}>
          <Title style={styles.CTATitleText}>Stupid Simple</Title>
          <Title style={styles.CTATitleText}>Docs as Code</Title>
          {props.serverProgress === UserProgress.Initial && (
            <Link href="/flow/getting_started/signup" passHref={true}>
              <Button type="primary" style={styles.CTAAction}>
                Get Started
              </Button>
            </Link>
          )}
          {props.serverProgress === UserProgress.SignedUp && (
            <Link href="/flow/getting_started/install" passHref={true}>
              <Button type="primary" style={styles.CTAAction}>
                Almost Done
              </Button>
            </Link>
          )}
        </div>
      </div>
      <div style={styles.ContentContainer}>
        <div style={styles.CTAContainer}>
          <SyncronizeDiagram />
        </div>
      </div>
      <div style={styles.ContentContainer}>
        <div style={styles.CTAContainer}>
          <Title style={styles.CTATitleText}>
            Stop{" "}
            <TextLoop
              children={["Wasting Time", "Redeploying", "Manually Versioning"]}
            />
          </Title>
        </div>
      </div>
      <div style={styles.ContentContainer}>
        <div style={styles.CTAContainer}>
          <div id="getting-started" style={styles.GSContainer}>
            <Divider style={styles.GSTitle}>How To Get Started</Divider>
            <GSSteps />
          </div>
        </div>
      </div>
    </>
  );
}

function SyncronizeDiagram() {
  return (
    <>
      <Title style={styles.CTASubTitleText}>
        Quickly and Automatically syncronize your Docs with your VCS
      </Title>
      <div style={styles.SDContainer}>
        <div style={styles.SDImageContainer}>
          <Image src="/github.svg" alt="Github Logo" height="80%" width="80%" />
        </div>
        <div style={styles.SDDividerContainer}>
          <Divider style={styles.SDDivider}>On Push</Divider>
        </div>
        <div style={{ ...styles.CTASubTitleText, ...styles.SDName }}>
          BlogLog
        </div>
      </div>
    </>
  );
}

function GSSteps() {
  const router = useRouter();
  const [progress, setProgress] = useState<number>(0);
  const [session, loading]: [SessionWithToken | null, boolean] = useSession();

  useEffect(() => {
    async function getProgress() {
      const newProgress = await getCurrentProgress(session);

      switch (newProgress) {
        case UserProgress.Initial:
          setProgress(-1);
          break;
        case UserProgress.SignedUp:
          setProgress(0);
          break;
        case UserProgress.Done:
          setProgress(3);
          break;
      }
    }
    getProgress();
  }, [session]);

  const onChange = (current: number) => {
    switch (current) {
      case 0: // sign up
        router.push("/flow/getting_started/signup");
        break;
      case 1: // install app
        router.push("/flow/getting_started/install");
        break;
      case 2: // done
        router.push("/user");
        break;
    }
  };

  return (
    <>
      <Steps direction="vertical" current={progress} onChange={onChange}>
        <Step disabled={progress !== -1} title="Sign Up" />
        <Step disabled={progress !== 0} title="Install Github App" />
        {progress !== 3 && <Step disabled title="Profit" />}
        {progress === 3 && <Step title="Profit 🎉🎉🎉" />}
      </Steps>
    </>
  );
}

/**
 * CTA - Call to Action
 * SD - Syncronize Diagram
 * GS - Get Started
 */
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
  CTATitleText: {
    fontSize: "3.5rem",
    fontFamily: "Roboto, sans-serif",
    letterSpacing: ".1rem",
    textTransform: "uppercase",
  },
  CTASubTitleText: {
    fontSize: "1.5rem",
    fontFamily: "Roboto, sans-serif",
    letterSpacing: ".1rem",
    textTransform: "uppercase",
  },
  CTAAction: {
    marginTop: "3rem",
    fontFamily: "Roboto, sans-serif",
    letterSpacing: ".1rem",
    textTransform: "uppercase",
  },
  GSTitle: {
    fontSize: "2rem",
    textTransform: "uppercase",
    letterSpacing: ".1rem",
  },
  SDContainer: {
    display: "flex",
    marginTop: "3rem",
    marginRight: "3rem",
  },
  SDImageContainer: {
    flex: 1,
    textAlign: "right",
  },
  SDDividerContainer: {
    margin: "auto",
    flex: 3,
  },
  SDDivider: {
    borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  SDName: {
    flex: 1,
    margin: "auto 0",
    fontWeight: 800,
    textAlign: "left",
  },
  GSContainer: {
    width: "60%",
    margin: "auto",
  },
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const newProgress = await getCurrentProgress(session);

  return {
    props: { serverProgress: newProgress },
  };
};

export default Home;
