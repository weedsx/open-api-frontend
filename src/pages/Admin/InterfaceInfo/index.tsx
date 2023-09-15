import CreateModal from '@/pages/Admin/InterfaceInfo/components/CreateModal';
import InterfaceDoc from '@/pages/InterfaceDetail/components/InterfaceDoc';
import {
  addInterfaceInfoUsingPOST,
  deleteInterfaceInfoUsingPOST,
  listInterfaceInfoUsingGET,
  offlineInterfaceInfoUsingPOST,
  onlineInterfaceInfoUsingPOST,
  updateInterfaceInfoUsingPOST,
} from '@/services/open-api-backend/interfaceInfoController';
import { DeleteOutlined, EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Button, Drawer, Popconfirm, Tag, message } from 'antd';
import { keyBy } from 'lodash';
import React, { useRef, useState } from 'react';
import ReactJson from 'react-json-view';
import UpdateModal from './components/UpdateModal';

const METHOD_ENUM = [
  { text: 'GET', value: '0', color: 'green' },
  { text: 'POST', value: '1', color: 'blue' },
  { text: 'PUT', value: '2', color: 'orange' },
  { text: 'DELETE', value: '3', color: 'red' },
];

let valueMethodDictionary = keyBy(METHOD_ENUM, 'value');
let textMethodDictionary = keyBy(METHOD_ENUM, 'text');

const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfo>();

  const [tableLoading, setTableLoading] = useState<boolean>(false);

  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */
  const handleAdd = async (fields: API.InterfaceInfoAddRequest) => {
    const hide = message.loading('正在添加');
    try {
      let method = fields.method;
      let m = METHOD_ENUM.find((m) => {
        return m.value === method;
      });
      fields.method = m.text;
      await addInterfaceInfoUsingPOST({ ...fields });
      hide();
      handleModalOpen(false);
      message.success('添加成功');
      actionRef.current?.reload();
      return true;
    } catch (error) {
      hide();
      message.error('添加失败' + error.message);
      return false;
    }
  };

  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields: API.InterfaceInfoUpdateRequest) => {
    const hide = message.loading('修改中');
    console.log(fields);
    try {
      let method = fields.method;
      let m = METHOD_ENUM.find((m) => {
        return m.value === method || m.text === method;
      });
      fields.method = m.text;
      await updateInterfaceInfoUsingPOST({
        ...fields,
      });
      hide();

      message.success('修改成功');
      return true;
    } catch (error) {
      hide();
      message.error('操作失败' + error.message);
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param row
   */
  const handleRemove = async (row: API.InterfaceInfo) => {
    const hide = message.loading('正在删除');
    if (!row) return true;
    try {
      await deleteInterfaceInfoUsingPOST({
        id: row.id,
      });
      hide();
      message.success('删除成功');
      actionRef.current?.reload();
      return true;
    } catch (error) {
      hide();
      message.error('删除失败' + error.message);
      return false;
    }
  };

  /**
   * 发布接口
   * @param row
   */
  const handleOnline = async (row: API.InterfaceInfo) => {
    const hide = message.loading('正在发布');
    if (!row) return true;
    try {
      await onlineInterfaceInfoUsingPOST({
        id: row.id,
      });
      hide();
      message.success('发布成功');
      actionRef.current?.reload();
      return true;
    } catch (error) {
      hide();
      message.error('发布失败' + error.message);
      return false;
    }
  };

  /**
   * 下线接口
   * @param row
   */
  const handleOffline = async (row: API.InterfaceInfo) => {
    const hide = message.loading('正在下线');
    if (!row) return true;
    try {
      await offlineInterfaceInfoUsingPOST({
        id: row.id,
      });
      hide();
      message.success('下线成功');
      actionRef.current?.reload();
      return true;
    } catch (error) {
      hide();
      message.error('下线失败' + error.message);
      return false;
    }
  };

  const popConfirm = async (record) => {
    await handleRemove(record);
  };

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.InterfaceInfo>[] = [
    {
      key: 'id',
      dataIndex: 'id',
      valueType: 'index',
    },
    {
      title: '接口名称',
      dataIndex: 'name',
      valueType: 'text',
      key: 'name',
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      valueType: 'select',
      key: 'method',
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
      valueEnum: textMethodDictionary,
      render: (_, { method }) => {
        const tagStatus = valueMethodDictionary[method] ||
          textMethodDictionary[method] || { color: 'purple', text: '未知' };
        return <Tag color={tagStatus.color}>{tagStatus.text}</Tag>;
      },
    },
    {
      title: 'url',
      dataIndex: 'url',
      valueType: 'text',
      key: 'url',
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
      key: 'description',
    },
    {
      title: '请求参数',
      dataIndex: 'requestParams',
      valueType: 'jsonCode',
      key: 'requestParams',
      hideInTable: true,
    },
    {
      title: '请求头',
      dataIndex: 'requestHeader',
      valueType: 'jsonCode',
      key: 'requestHeader',
      hideInTable: true,
      render: (_, record) => [<ReactJson key="reactJson" src={record?.requestHeader} />],
    },
    {
      title: '响应头',
      dataIndex: 'responseHeader',
      valueType: 'jsonCode',
      key: 'responseHeader',
      hideInTable: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      key: 'status',
      valueEnum: {
        0: {
          text: '关闭',
          status: 'error',
        },
        1: {
          text: '开启',
          status: 'success',
        },
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      key: 'updateTime',
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      valueType: 'option',
      key: 'operation',
      render: (_, record) => [
        <Button
          type={'text'}
          size={'small'}
          key="more"
          // style={{ color: '#313131'}}
          icon={<EllipsisOutlined />}
          onClick={() => {
            setShowDetail(true);
            setCurrentRow(record);
          }}
        >
          详情
        </Button>,
        <Button
          type={'text'}
          size={'small'}
          key="update"
          style={{ color: '#1677ff' }}
          onClick={() => {
            handleUpdateModalOpen(true);
            setCurrentRow(record);
          }}
        >
          修改
        </Button>,
        record.status === 0 && (
          <Button
            type={'text'}
            size={'small'}
            key="online"
            style={{ color: '#2edd57' }}
            onClick={async () => {
              await handleOnline(record);
            }}
          >
            发布
          </Button>
        ),
        record.status === 1 && (
          <Button
            size={'small'}
            type={'text'}
            key="offline"
            style={{ color: '#ff9c2d' }}
            onClick={async () => {
              await handleOffline(record);
            }}
          >
            下线
          </Button>
        ),
        <Popconfirm
          key="delete"
          title="删除该接口"
          description="确定要删除？"
          onConfirm={async () => {
            await popConfirm(record);
          }}
          okText="Yes"
          cancelText="No"
          icon={<DeleteOutlined style={{ color: 'red' }} />}
        >
          <Button type={'text'} size={'small'} danger>
            删除
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.InterfaceInfo, API.PageParams>
        loading={tableLoading}
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined />
            <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={async (params: API.listInterfaceInfoUsingGETParams) => {
          setTableLoading(true);
          let res = await listInterfaceInfoUsingGET({ ...params });
          if (res.data) {
            setTableLoading(false);
            return {
              data: res.data,
              success: true,
              // total : ;
            };
          }
        }}
        columns={columns}
      />

      <UpdateModal
        columns={columns}
        onSubmit={async (value) => {
          // console.log(value);
          const success = await handleUpdate({ id: currentRow?.id, ...value });
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current?.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        visible={updateModalOpen}
        values={currentRow || {}}
      />

      <Drawer
        width={700}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
        placement="right"
      >
        <InterfaceDoc interfaceInfo={currentRow} />
      </Drawer>

      <CreateModal
        onCancel={() => {
          handleModalOpen(false);
        }}
        onSubmit={async (values) => {
          await handleAdd(values);
        }}
        visible={createModalOpen}
        columns={columns}
      />
    </PageContainer>
  );
};

export default TableList;
