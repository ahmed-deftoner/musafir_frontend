import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import {RecoilRoot} from 'recoil';
import AlertContainer from './alert';
import { Toaster } from "@/components/ui/toaster";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
    <SessionProvider session={pageProps.session}>
      <RecoilRoot>
        <Component {...pageProps} />;
        <AlertContainer />
        <Toaster />
      </RecoilRoot>
    </SessionProvider>

    </>
  ) 
}
