import '../styles/globals.css'
import * as Sentry from "@sentry/nextjs";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
