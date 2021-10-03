import nextApp, { AppProps, AppContext } from 'next/app';
import { ThemeProvider } from 'styled-components';

import { GlobalStyle } from '../styles/globalStyles';
import { theme } from '../styles/theme';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await nextApp.getInitialProps(appContext);

  return { ...appProps };
};

export default App;
