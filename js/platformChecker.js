/* eslint-disable no-nested-ternary */
import {
  isIOS,
  isSafari,
  isTablet,
} from 'react-device-detect';
import { isInstalled } from './utils';

export default function PlatformChecker() {
  return (
    false && (!isIOS || !isTablet)
      ? (
        <div className='platform-check-container'>
          <div className='platform-check'>
            <h3>
              The application is not compatible with this device.
              {' '}
              <br />
              {' '}
              Open with
              {' '}
              <strong>Safari browser</strong>
              {' '}
              on
              {' '}
              <strong>Apple iPad</strong>
              {' '}
              to begin
            </h3>
          </div>
        </div>
      )
      : false && (isIOS && isTablet && !isSafari)
        ? (
          <div className='platform-check-container'>
            <div className='platform-check'>
              <h3>
                The application is not compatible with this browser. Open with
                {' '}
                <strong>Safari browser</strong>
                {' '}
                to begin.
              </h3>
            </div>
          </div>
        )
        : false && !isInstalled()
          ? (
            <div className='platform-check-container'>
              <div className='platform-check'>
                <h3>You need to install this application to proceed</h3>

                <ol>
                  <li>
                    Tap the
                    {' '}
                    <strong>Share</strong>
                    {' '}
                    <img src='/img/share.svg' alt='share icon' />
                    {' '}
                    button at the top right of the browser
                  </li>
                  <li>
                    Select
                    {' '}
                    <strong>Add to Home Screen</strong>
                  </li>
                </ol>
              </div>
            </div>
          )
          : ''
  );
}
