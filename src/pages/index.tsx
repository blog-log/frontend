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
      <div className="bg-white p-1 md:p-8 mb-4 md:mb-8 lg:mb-12">
        <div className="text-center m-4 md:m-8 lg:m-12">
          <h1 className="uppercase font-semibold tracking-wide text-4xl sm:text-6xl md:text-7xl lg:text-8xl mb-4 md:m-8 lg:m-12">
            Stupid Simple
          </h1>
          <h1 className="uppercase font-semibold tracking-wide text-4xl sm:text-6xl md:text-7xl lg:text-8xl mb-4 md:m-8 lg:m-12">
            Docs as Code
          </h1>
          {props.serverProgress === UserProgress.Initial && (
            <Link href="/flow/getting_started/signup" passHref={true}>
              <Button
                type="primary"
                size="large"
                className="uppercase tracking-wide mt-2"
              >
                Get Started
              </Button>
            </Link>
          )}
          {props.serverProgress === UserProgress.SignedUp && (
            <Link href="/flow/getting_started/install" passHref={true}>
              <Button
                type="primary"
                size="large"
                className="uppercase tracking-wide mt-2"
              >
                Almost Done
              </Button>
            </Link>
          )}
        </div>
      </div>
      <div className="bg-white p-1 md:p-8 mb-4 md:mb-8 lg:mb-12">
        <div className="text-center m-4 md:m-8 lg:m-12">
          <SyncronizeDiagram />
        </div>
      </div>
      <div className="bg-white p-1 md:p-8 mb-4 md:mb-8 lg:mb-12">
        <div className="text-center m-4 md:m-8 lg:m-12">
          <h1 className="uppercase font-semibold tracking-wide text-2xl sm:text-3xl md:text-5xl lg:text-7xl mb-4 md:m-8 lg:m-12">
            Stop{" "}
            <TextLoop
              children={["Wasting Time", "Redeploying", "Manually Versioning"]}
            />
          </h1>
        </div>
      </div>
      <div className="bg-white p-1 md:p-8 mb-4 md:mb-8 lg:mb-12">
        <div className="text-center m-4 md:m-8 lg:m-12">
          <div id="getting-started" className="w-3/5 m-auto">
            <Divider>
              <span className="uppercase font-semibold tracking-wide text-1xl sm:text-2xl md:text-3xl lg:text-5xl">
                How To Get Started
              </span>
            </Divider>
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
      <h1 className="uppercase tracking-wide font-semibold text-xl sm:text-2xl md:text-4xl lg:text-6xl">
        Quickly and Automatically syncronize your Docs with your VCS
      </h1>
      <div className="flex mt-4 md:m-8 lg:m-12 items-center">
        <div className="flex text-right relative h-10 md:h-15 lg:h-20 w-10 md:w-15 lg:w-20">
          <Image src="/github.svg" alt="Github Logo" layout="fill" />
        </div>
        <div className="m-auto flex-grow">
          <Divider className="border-gray-200 p-0">
            <span className="text-base md:text-lg lg:text-xl">On Push</span>
          </Divider>
        </div>
        <div className="text-left m-auto uppercase text-lg md:text-2xl lg:text-4xl tracking-wide font-semibold">
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
