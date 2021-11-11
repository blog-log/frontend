import { Popover, Button, Typography } from "antd";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession, signIn, useSession } from "next-auth/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SessionWithToken } from "../../../common/types/session";
import {
  getCurrentProgress,
  UserProgress,
} from "../../../common/utils/progress";

const { Title } = Typography;

interface ISignUp {
  serverProgress: UserProgress;
  session: Session | null;
}

function SignUp(props: ISignUp) {
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
      {progress === UserProgress.Initial && <Ready />}
      {progress === UserProgress.SignedUp && <Completed />}
      {progress === UserProgress.Done && <Completed />}
    </>
  );
}

const Ready = () => (
  <div className="bg-white p-3 md:p-8 mb-4 md:mb-8 lg:mb-12">
    <div className="text-center w-full md:w-7/12 m-auto mb-4 md:mb-8 lg:mb-12">
      <Title level={4}>The first step is to sign in to your VCS</Title>
    </div>
    <div className="text-center w-full md:w-7/12 m-auto mb-4 md:mb-8 lg:mb-12">
      <Title level={4}>Currently only github is supported</Title>
    </div>
    <div className="text-center w-full md:w-7/12 m-auto mb-4 md:mb-8 lg:mb-12">
      <Button onClick={() => signIn()} type="primary">
        Sign Up
      </Button>
    </div>

    <div className="flex">
      <div className="flex-1 text-center"></div>
      <div className="flex-1 text-center">
        {/* fake button does not do anything */}
        <Popover content="you are not signed in">
          <Button disabled type="primary">
            Next
          </Button>
        </Popover>
      </div>
    </div>
  </div>
);

const Completed = () => (
  <div className="bg-white p-3 md:p-8 mb-4 md:mb-8 lg:mb-12">
    <div className="text-center w-full md:w-7/12 m-auto mb-4 md:mb-8 lg:mb-12">
      <Title level={4}>Hurray!!! You are signed in</Title>
    </div>
    <div className="text-center w-full md:w-7/12 m-auto mb-4 md:mb-8 lg:mb-12">
      <Title level={4}>Please go to the next step</Title>
    </div>
    <div className="flex">
      <div className="flex-1 text-center"></div>
      <div className="flex-1 text-center">
        <Link passHref href="/flow/getting_started/install">
          <Button type="primary">Next</Button>
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

export default SignUp;
