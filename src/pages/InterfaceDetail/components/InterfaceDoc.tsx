import { METHOD_TYPE_WITH_BODY } from '@/constants/HttpConstant';
import { MethodTag } from '@/pages/Index/components/MethodTag';
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Badge, Descriptions, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';

interface DataType {
  key: React.Key;
  name: string;
  value: string;
}

const Doc: React.FC<{
  interfaceInfo: API.InterfaceInfo | undefined;
}> = ({ interfaceInfo }) => {
  const [requestParamsArr, setRequestParamsArr] = useState<DataType[]>([]);

  useEffect(() => {
    if (interfaceInfo !== undefined && interfaceInfo !== null) {
      const reqParamsObj = JSON.parse(interfaceInfo?.requestParams as string);
      let newArr: DataType[] = [];
      // eslint-disable-next-line guard-for-in
      for (const key in reqParamsObj) {
        newArr.push({ key: key, name: key, value: reqParamsObj[key] });
      }
      setRequestParamsArr(newArr);
    }
  }, [interfaceInfo]);

  const columns: ColumnsType<DataType> = [
    {
      title: '参数名',
      dataIndex: 'name',
      width: 300,
    },
    {
      title: '参数值',
      dataIndex: 'value',
      width: 800,
    },
  ];

  return interfaceInfo ? (
    <Descriptions title={interfaceInfo.name} column={1}>
      <Descriptions.Item label="Url">
        <Typography.Paragraph copyable>{interfaceInfo.url}</Typography.Paragraph>
      </Descriptions.Item>
      <Descriptions.Item label="请求类型">
        <MethodTag method={interfaceInfo.method ?? ''} />
      </Descriptions.Item>
      <Descriptions.Item label="状态">
        <Badge
          status={interfaceInfo.status === 0 ? 'error' : 'success'}
          text={interfaceInfo.status === 0 ? '关闭' : '正常'}
        />
      </Descriptions.Item>
      <Descriptions.Item label="描述">{interfaceInfo.description ?? '-'}</Descriptions.Item>
      <Descriptions.Item label="请求参数">
        {METHOD_TYPE_WITH_BODY.includes(interfaceInfo.method as string) ? (
          <ReactJson src={JSON.parse((interfaceInfo.requestParams as string) ?? '{}')} />
        ) : (
          <Table columns={columns} dataSource={requestParamsArr} pagination={false} />
        )}
      </Descriptions.Item>
      <Descriptions.Item label="请求头">
        <ReactJson src={JSON.parse((interfaceInfo.requestHeader as string) ?? '{}')} />
      </Descriptions.Item>
      <Descriptions.Item label="响应头">
        <ReactJson src={JSON.parse((interfaceInfo.responseHeader as string) ?? '{}')} />
      </Descriptions.Item>
      <Descriptions.Item label="更新时间">
        {moment(interfaceInfo.updateTime).format('YYYY-MM-DD HH:mm')}
      </Descriptions.Item>
    </Descriptions>
  ) : (
    <>接口不存在</>
  );
};

const InterfaceDoc: React.FC<{
  interfaceInfo: API.InterfaceInfo | undefined;
}> = ({ interfaceInfo }) => {
  const { location } = history;

  return (
    <>
      {location.pathname === '/admin/interface' ? (
        <PageContainer title={'接口详情'}>
          <Doc interfaceInfo={interfaceInfo} />
        </PageContainer>
      ) : (
        <Doc interfaceInfo={interfaceInfo} />
      )}
    </>
  );
};

export default InterfaceDoc;
