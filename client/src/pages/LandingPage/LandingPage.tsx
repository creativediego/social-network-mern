import { ReactElement } from 'react';
import './LandingPage.scss';
import AppConfig from '../../config';

export interface LandingViewProps {
  children: ReactElement;
}

const LandingPage = ({ children }: LandingViewProps): JSX.Element => {
  return (
    <div className='container-fluid p-0 m-0'>
      <div className='row p-0 vh-100 vw-100'>
        <div className='bg-black text-white col-lg-6 order-lg-2 d-flex justify-content-center align-items-center'>
          <div className='container'>{children}</div>
        </div>
        <div className='col-lg-6 order-lg-1 bg-primary d-flex justify-content-center align-items-center'>
          <p
            className={`text-center ${AppConfig.brand.iconClass} text-white`}
            style={{ fontSize: '20rem' }}
          ></p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
