import InterfaceDoc from '@/pages/InterfaceDetail/components/InterfaceDoc';
import InvokeTest from '@/pages/InterfaceDetail/components/InvokeTest';
import { getInterfaceInfoByIdUsingGET } from '@/services/open-api-backend/interfaceInfoController';
import { useParams } from '@@/exports';
import { BugOutlined, FileTextOutlined, HomeOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { Breadcrumb, Tabs, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';

const InterfaceDetailIndex: React.FC = () => {
  const [interfaceInfo, setInterfaceInfo] = useState<API.InterfaceInfo>();

  /**
   * 获取接口详细信息
   * @param id
   */
  const fetchInterfaceList = async (id: string | undefined) => {
    const hide = message.loading('正在加载');
    try {
      let res = await getInterfaceInfoByIdUsingGET({ id: parseInt(id ?? '') });
      hide();
      setInterfaceInfo(res.data);
      return true;
    } catch (error: any) {
      hide();
      message.error('加载失败' + error.message);
      return false;
    }
  };

  const params = useParams();

  useEffect(() => {
    fetchInterfaceList(params?.id);
  }, []);

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: '10px' }}
        items={[
          {
            href: '/welcome',
            // onClick: () => history.push('/welcome'),
            // path: '/welcome',
            title: <HomeOutlined />,
          },
          {
            title: '接口卡片',
            // path:'/welcome'
            onClick: () => history.push('/welcome'),
            // href: '/welcome',
          },
          {
            title: interfaceInfo?.name ?? '-',
          },
        ]}
      />
      <Typography.Title level={3} style={{ marginBottom: '20px' }}>
        接口文档
      </Typography.Title>
      <Tabs
        defaultActiveKey="doc"
        tabPosition="left"
        type="card"
        animated={true}
        tabBarGutter={15}
        items={[
          {
            key: 'doc',
            label: (
              <span>
                <FileTextOutlined />
                文档
              </span>
            ),
            children: <InterfaceDoc interfaceInfo={interfaceInfo} />,
          },
          {
            key: 'testInvoke',
            label: (
              <span>
                <BugOutlined />
                调试
              </span>
            ),
            children: <InvokeTest interfaceInfo={interfaceInfo} />,
          },
        ]}
      />
    </>
  );
};

export default InterfaceDetailIndex;
