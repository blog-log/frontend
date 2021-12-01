/* eslint-disable react/no-children-prop */
import Image from "next/image";
import TextLoop from "react-text-loop";
import { Layout, Button, Steps, Divider } from "antd";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { getCurrentProgress, UserProgress } from "../common/utils/progress";
import { GetServerSideProps } from "next";
import Header from "../common/components/elements/Header/Header";
import { DeviceType } from "../common/utils/device";

const { Content } = Layout;
const { Step } = Steps;

interface IHome {
  serverProgress: UserProgress;
  deviceType: DeviceType;
}

function Home(props: IHome) {
  return (
    <Layout>
      <Header deviceType={props.deviceType} />
      <Content className="p-2 md:p-6 lg:p-12">
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
                children={[
                  "Wasting Time",
                  "Redeploying",
                  "Manually Versioning",
                ]}
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
      </Content>
    </Layout>
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
  const { data: session, status } = useSession();

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const newProgress = await getCurrentProgress(session);

  return {
    props: {
      session,
      serverProgress: newProgress,
    },
  };
};

export default Home;
