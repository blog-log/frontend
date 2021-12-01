import "../common/styles/global.scss";
import "../common/styles/tailwind.css";

import App, { AppContext } from "next/app";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { withRouter } from "next/router";

import { DeviceType, getDeviceType } from "../common/utils/device";
import Head from "next/head";

function MyApp({
  Component,
  pageProps: { session, ...pageProps },
  deviceType,
}: AppProps & { deviceType: DeviceType }) {
  return (
    // `session` comes from `getServerSideProps` or `getInitialProps`.
    // Avoids flickering/session loading on first load.
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        ></meta>
      </Head>
      <Component {...pageProps} deviceType={deviceType} />
    </SessionProvider>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
MyApp.getInitialProps = async (appContext: AppContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  // determine device type
  const deviceType = getDeviceType(appContext.ctx.req);

  return { ...appProps, deviceType };
};

export default withRouter(MyApp);
