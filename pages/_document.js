import Document, {
  Html, Head, Main, NextScript,
} from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html manifest='/cache.manifest'>
        <Head />
        <title>Sanofi Quiz</title>
        <link href='https://fonts.cdnfonts.com/css/sf-ui-display' rel='stylesheet' />
        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name='viewport' content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no' />
        <meta name='description' content='An app for administering quizes by Sanofi medical representatives to their stakeholders.' />
        <meta name='keywords' content='Keywords' />
        <meta name='apple-mobile-web-app-title' content='Sanofi Quiz' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='screen-orientation' content='portrait' />
        <meta name='theme-color' content='#2E1D5F' />

        <link rel='apple-touch-icon' href='/icons/192.png' />
        <link rel='apple-touch-icon' sizes='180x180' href='/icons/180.png' />
        <link rel='apple-touch-icon' sizes='512x512' href='/icons/512.png' />
        <link rel='apple-touch-icon' sizes='512x512' href='/icons/512.png' />
        <link rel='apple-touch-icon' sizes='512x512' href='/icons/512.png' />
        <link rel='apple-touch-icon' sizes='1024x1024' href='/icons/1024.png' />
        <link rel='apple-touch-icon' sizes='167x167' href='/icons/167.png' />

        <link rel='apple-touch-startup-image' media='screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)' href='/icons/launch-landscape.png' />

        <link rel='apple-touch-startup-image' media='screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)' href='/icons/launch.png' />

        <link href='/manifest.json' rel='manifest' />
        <link rel='icon' href='/favicon.ico' />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
