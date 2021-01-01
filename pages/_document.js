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
        <meta name='viewport' content='viewport-fit=cover' />
        <meta name='description' content='An app for administering quizzes by Sanofi medical representatives to their stakeholders.' />
        <meta name='theme-color' content='#2E1D5F' />
        <link href='manifest.json' rel='manifest' />
        <meta content='@tolulawson' name='author' />
        <link rel='icon' href='icons/512.png' sizes='512x512' />
        <link rel='icon' href='icons/256.png' sizes='256x256' />
        <link rel='icon' href='icons/128.png' sizes='128x128' />
        <link rel='icon' href='icons/32.png' sizes='32x32' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='x5-orientation' content='portrait' />
        <meta name='screen-orientation' content='portrait' />
        <meta name='x5-page-mode' content='app' />
        <meta name='browsermode' content='application' />
        <link rel='apple-touch-icon' href='icons/180.png' />

        <link
          rel='apple-touch-startup-image'
          media='screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)'
          href='icons/2048x1536.png'
        />
        <link
          rel='apple-touch-startup-image'
          media='screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)'
          href='icons/1536x2048.png'
        />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
