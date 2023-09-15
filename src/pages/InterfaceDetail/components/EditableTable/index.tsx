import type { InputRef } from 'antd';
import { Form, Input, Table } from 'antd';
import type { FormInstance } from 'antd/es/form';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Param } from '../../../../../types';
import './index.css';

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  age: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  name: string;
  value: string;
}

type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>;

const EditableTable: React.FC<{
  interfaceInfo: API.InterfaceInfo|undefined;
  onCollectParam: (params: Param[]) => void;
}> = ({ interfaceInfo, onCollectParam }) => {
  /**
   * 请求参数
   */
  const [dataSource, setDataSource] = useState<DataType[]>(() => {
    const reqParamObj = JSON.parse(interfaceInfo?.requestParams as string);
    const dataSource: DataType[] = [];
    // eslint-disable-next-line guard-for-in
    for (let key in reqParamObj) {
      dataSource.push({
        key: key,
        name: key,
        value: reqParamObj[key],
      });
    }
    return dataSource;
  });
  /**
   * 选中的参数行的 key 组成的数组
   */
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: '参数名',
      dataIndex: 'name',
      width: '30%',
    },
    {
      title: '参数值',
      dataIndex: 'value',
      editable: true,
    },
  ];

  const collectRequestParam = (
    preSelectedRowKeys: React.Key[] = selectedRowKeys,
    preDataSource: DataType[] = dataSource,
  ) => {
    const selectedRow = preDataSource.filter((data) => preSelectedRowKeys.includes(data.key));

    const mappedSelectedParams = selectedRow.map((row) => {
      const { name, value } = row;
      return { name, value };
    });
    onCollectParam(mappedSelectedParams)
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
    setDataSource((preState) => {
      collectRequestParam(selectedRowKeys, preState);
      return preState;
    });
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    } else {
      return {
        ...col,
        onCell: (record: DataType) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave,
        }),
      };
    }
  });

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
    setSelectedRowKeys((preState) => {
      collectRequestParam(preState);
      return preState;
    });
  };

  return (
    <div>
      <Table
        pagination={false}
        components={components}
        rowClassName={() => 'editable-row'}
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
      />
    </div>
  );
};

export default EditableTable;
