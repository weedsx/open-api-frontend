import { MethodTag } from '@/pages/Index/components/MethodTag';
import { pageInterfaceInfoUsingGET } from '@/services/open-api-backend/interfaceInfoController';
import { HomeOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { Badge, Breadcrumb, Card, List, Space, Typography, message } from 'antd';
import React, { useEffect, useState } from 'react';

const Index: React.FC = () => {
  const [interfaceList, setInterfaceList] = useState<API.InterfaceInfo[]>();
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [total, setTotal] = useState<number>(0);

  const fetchInterfaceList = async (current = 1, pageSize = 16) => {
    const hide = message.loading('正在加载');
    setListLoading(true);
    try {
      let res = await pageInterfaceInfoUsingGET({
        current,
        pageSize,
      });
      hide();
      setInterfaceList(res.data?.records);
      setCurrentPage(res.data?.current ?? 1);
      setPageSize(res.data?.size ?? 20);
      setTotal(res.data?.total ?? 0);
      setListLoading(false);
      return true;
    } catch (error: any) {
      hide();
      message.error('加载失败' + error.message);
      setListLoading(false);
      return false;
    }
  };

  useEffect(() => {
    fetchInterfaceList();
  }, []);

  const { Meta } = Card;

  return (
    <>
      <Breadcrumb
        style={{ marginBottom: '10px' }}
        items={[
          {
            // href: 'http://localhost:8001/welcome',
            onClick: () => history.push('/welcome'),
            title: <HomeOutlined />,
          },
          {
            title: '接口卡片',
          },
        ]}
      />
      <Typography.Title level={3} style={{ marginBottom: '20px' }}>
        接口卡片
      </Typography.Title>
      <List
        loading={listLoading}
        grid={{ gutter: 16, column: 4 }}
        dataSource={interfaceList}
        renderItem={(item) => (
          <List.Item>
            <Card
              title={
                <>
                  <Badge
                    status={item.status === 0 ? 'error' : 'success'}
                    style={{ marginRight: '10px' }}
                  />
                  {item?.name}
                </>
              }
              hoverable
              onClick={() => {
                history.push(`/interface-detail/${item?.id}`);
              }}
            >
              <Meta
                title={
                  <Space size={1}>
                    <MethodTag method={item?.method ?? '-'} />
                    {item?.url}
                  </Space>
                }
                description={item?.description ?? '-'}
              />
            </Card>
          </List.Item>
        )}
        pagination={{
          current: currentPage,
          total: total,
          pageSize: pageSize,
          showSizeChanger: false,
          onChange: async (curr, size) => {
            await fetchInterfaceList(curr, size);
          },
          responsive: true,
          showTotal: (t, r) => {
            return `${r[0]} - ${r[1]} / ${t}`;
          },
        }}
      />
    </>
  );
};

export default Index;
