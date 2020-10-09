import '../styles/index.css';
import { SWRConfig } from 'swr';
import { AppProps } from 'next/app';
import fetch from '../lib/fetch-json';
import '../i18n';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: fetch,
        onError: (err) => {
          console.error(err);
        }}
      }>
      <div className="h-screen bg-gray-100">
        <Component {...pageProps} />
      </div>
      <style global jsx>{`
        html,
        body,
        body > div:first-child,
        div#__next,
        div#__next > div,
        div#__next > div > div {
          height: 100%;
        }
      `}</style>
    </SWRConfig>
  );
}
