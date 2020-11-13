import '../styles/globals.css';

function MyApp({ Component, pageProps }) {

  const eventDetails = useEventDetails({});

  return (
    <Component {...pageProps} />
  )
}

export default MyApp
