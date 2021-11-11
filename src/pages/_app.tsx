import "../common/styles/global.scss";
import "../common/styles/tailwind.css";

import App, { AppContext } from "next/app";
import type { AppProps } from "next/app";
import { Provider } from "next-auth/client";
import { withRouter } from "next/router";

import Basic, {
  BasicNoContentContainer,
  BasicOnlyContent,
} from "../common/components/templates/Basic/Basic";
import { DeviceType, getDeviceType } from "../common/utils/device";

function MyApp({
  Component,
  pageProps,
  router,
  deviceType,
}: AppProps & { deviceType: DeviceType }) {
  // simple router
  switch (router.asPath) {
    case "/":
      return (
        <Provider session={pageProps.session}>
          <BasicNoContentContainer deviceType={deviceType} {...pageProps}>
            <Component {...pageProps} />
          </BasicNoContentContainer>
        </Provider>
      );
    case router.asPath.match(/^\/flow\/getting_started/)?.input:
      return (
        <Provider session={pageProps.session}>
          <BasicOnlyContent deviceType={deviceType} {...pageProps}>
            <Component {...pageProps} />
          </BasicOnlyContent>
        </Provider>
      );
    default:
      return (
        <Provider session={pageProps.session}>
          <BasicNoContentContainer deviceType={deviceType} {...pageProps}>
            <Component {...pageProps} />
          </BasicNoContentContainer>
        </Provider>
      );
  }
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
