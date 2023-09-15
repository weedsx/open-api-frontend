import { METHOD_TYPE_WITH_BODY } from '@/constants/HttpConstant';
import { MethodTag } from '@/pages/Index/components/MethodTag';
import EditableTable from '@/pages/InterfaceDetail/components/EditableTable';
import { invokeInterfaceInfoUsingPOST } from '@/services/open-api-backend/interfaceInfoController';
import { RocketOutlined } from '@ant-design/icons';
import { Button, Card, Input, Tabs, TabsProps, Tooltip, Typography, message } from 'antd';
import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import { Param } from '../../../../types';

const InvokeTest: React.FC<{
  interfaceInfo: API.InterfaceInfo | undefined;
}> = ({ interfaceInfo }) => {
  // const [requestParams, setRequestParams] = useState(
  //   JSON.parse(interfaceInfo.requestParams as string) ?? {},
  // );
  /**
   * 原始请求参数
   */
  const [requestParams, setRequestParams] = useState(
    JSON.parse(interfaceInfo?.requestParams as string),
  );
  // const [requestHeader, setRequestHeader] = useState(
  //   JSON.parse(interfaceInfo.requestHeader as string) ?? {},
  // );
  /**
   * 原始请求头
   */
  const [requestHeader, setRequestHeader] = useState(
    JSON.parse(interfaceInfo?.requestHeader as string),
  );
  const [responseLoading, setResponseLoading] = useState(false);
  /**
   * 接口响应
   */
  const [response, setResponse] = useState(JSON.parse('{}'));

  /**
   * 要发送的接口参数
   */
  const [selectedParams, setSelectedParams] = useState<Param[]>([]);

  const editTip = <span>Ctrl/Cmd + Click 进行编辑</span>;
  const confirmTip = <span>Ctrl/Cmd + Enter 进行确认</span>;

  const tip = (
    <>
      {editTip}
      <br />
      {confirmTip}
    </>
  );

  const onCollectParam = (params: Param[]) => {
    setSelectedParams(params);
  };

  const invokeInterface = async () => {
    const hide = message.loading('正在调用');
    setResponseLoading(true);
    try {
      let res: API.BaseResponseobject;
      // 包含请求体的请求
      if (METHOD_TYPE_WITH_BODY.includes(interfaceInfo?.method as string)) {
        res = await invokeInterfaceInfoUsingPOST({
          id: interfaceInfo?.id,
          userRequestParams: JSON.stringify(requestParams),
        });
      } else {
        res = await invokeInterfaceInfoUsingPOST({
          id: interfaceInfo?.id,
          userRequestParams: JSON.stringify(selectedParams),
        });
      }
      hide();
      setResponse({ ...res });
      setResponseLoading(false);
      return true;
    } catch (error: any) {
      hide();
      message.error('调用失败' + error.message);
      return false;
    }
  };

  const requestItems: TabsProps['items'] = [
    {
      key: 'requestParams',
      label: '请求参数',
      children: (
        <>
          {METHOD_TYPE_WITH_BODY.includes(interfaceInfo?.method as string) ? (
            <>
              <Tooltip placement="left" title={tip}>
                <Button type="link">查看快捷键</Button>
              </Tooltip>
              <ReactJson
                src={{ ...requestParams }}
                onEdit={(edit) => {
                  setRequestParams(edit.updated_src);
                }}
              />
            </>
          ) : (
            <EditableTable interfaceInfo={interfaceInfo} onCollectParam={onCollectParam} />
          )}
        </>
      ),
    },
    {
      key: 'requestHeader',
      label: '请求头',
      children: (
        <>
          <Tooltip placement="left" title={tip}>
            <Button type="link">查看快捷键</Button>
          </Tooltip>
          <ReactJson
            src={{ ...requestHeader }}
            onEdit={(edit) => {
              setRequestHeader(edit.updated_src);
            }}
          />
        </>
      ),
    },
  ];

  const responseItems: TabsProps['items'] = [
    {
      key: 'response',
      label: '响应内容',
      children: <ReactJson src={{ ...response }} />,
    },
    {
      key: 'responseHeader',
      label: '响应头',
      children: <ReactJson src={JSON.parse(interfaceInfo?.responseHeader as string) ?? {}} />,
    },
  ];

  return (
    <div className="invoke-test">
      <Typography.Title level={5} style={{ marginBottom: '20px' }}>
        {interfaceInfo?.name ?? '-'}
      </Typography.Title>

      <Input.Search
        style={{ width: '85%' }}
        size={'large'}
        prefix={<MethodTag method={interfaceInfo?.method as string} />}
        enterButton={
          <>
            <RocketOutlined />
            &nbsp; 发送
          </>
        }
        placeholder="测试接口URL"
        defaultValue={interfaceInfo?.url}
        onSearch={async () => {
          await invokeInterface();
        }}
      />

      <Card style={{ marginTop: '25px', width: '85%' }} type="inner">
        <Tabs items={requestItems} />
      </Card>

      <Card style={{ marginTop: '25px', width: '85%' }} type="inner" loading={responseLoading}>
        <Tabs items={responseItems} />
      </Card>
    </div>
  );
};

export default InvokeTest;
