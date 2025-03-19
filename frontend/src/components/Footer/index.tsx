import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      links={[
        {
          key: 'plant',
          title: 'Department of Justice',
          href: 'https://www.doj.gov.hk/sc/home/index.html',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/ant-design/ant-design-pro',
          blankTarget: true,
        },
        {
          key: 'name',
          title: 'Hong Kong',
          href: 'https://www.gov.hk/tc/residents/',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
