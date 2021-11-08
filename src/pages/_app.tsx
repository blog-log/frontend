import "../common/styles/global.scss";
import type { AppProps } from "next/app";
import { Provider } from "next-auth/client";
import { withRouter } from "next/router";

import Basic, {
  BasicNoContentContainer,
  BasicOnlyContent,
} from "../common/components/templates/Basic/Basic";

function MyApp({ Component, pageProps, router }: AppProps) {
  // simple router
  switch (router.asPath) {
    case "/":
      return (
        <Provider session={pageProps.session}>
          <BasicNoContentContainer {...pageProps}>
            <Component {...pageProps} />
          </BasicNoContentContainer>
        </Provider>
      );
    case router.asPath.match(/^\/flow\/getting_started/)?.input:
      return (
        <Provider session={pageProps.session}>
          <BasicOnlyContent {...pageProps}>
            <Component {...pageProps} />
          </BasicOnlyContent>
        </Provider>
      );
    default:
      return (
        <Provider session={pageProps.session}>
          <Basic {...pageProps}>
            <Component {...pageProps} />
          </Basic>
        </Provider>
      );
  }
}

export default withRouter(MyApp);
