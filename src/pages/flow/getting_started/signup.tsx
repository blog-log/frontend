import { Popover, Button, Typography } from "antd";
import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession, signIn, useSession } from "next-auth/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SessionWithToken } from "../../../common/types/session";
import { StyleMap } from "../../../common/types/style";
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
  <div style={styles.ContentContainer}>
    <div style={styles.CTAContainer}>
      <Title level={4}>The first step is to sign in to your VCS</Title>
    </div>
    <div style={styles.CTAContainer}>
      <Title level={4}>Currently only github is supported</Title>
    </div>
    <div style={styles.CTAContainer}>
      <Button onClick={() => signIn()} type="primary">
        Sign Up
      </Button>
    </div>

    <div style={styles.ButtonsContainer}>
      <div style={styles.BackContainer}></div>
      <div style={styles.NextContainer}>
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
  <div style={styles.ContentContainer}>
    <div style={styles.CTAContainer}>
      <Title level={4}>Hurray!!! You are signed in</Title>
    </div>
    <div style={styles.CTAContainer}>
      <Title level={4}>Please go to the next step</Title>
    </div>
    <div style={styles.ButtonsContainer}>
      <div style={styles.BackContainer}></div>
      <div style={styles.NextContainer}>
        <Link passHref href="/flow/getting_started/install">
          <Button type="primary">Next</Button>
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

export default SignUp;
