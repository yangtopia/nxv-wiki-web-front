import React from 'react';
import styled from 'styled-components';

const Footer = styled.footer`
  height: 130px;
  font-size: 10px;
`;

const FooterComponent: React.FC = () => (
  <Footer>
    <p>Nexivil Archive Labs v{process.env.NXV_ENV.APP_VERSION}</p>
    <p>Copyright © NEXIVIL Inc. All rights reserved.</p>
  </Footer>
);

export default FooterComponent;
