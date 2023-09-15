import { ProColumns, ProFormInstance, ProTable } from '@ant-design/pro-components';
import { Modal } from 'antd';
import React, { useEffect, useRef } from 'react';

const UpdateModal: React.FC<{
  values: API.InterfaceInfoUpdateRequest;
  onCancel: (flag?: boolean) => void;
  onSubmit: (values: API.InterfaceInfoAddRequest) => Promise<void>;
  visible: boolean;
  columns: ProColumns<API.InterfaceInfo>[];
}> = ({ visible, onCancel, onSubmit, columns, values }) => {
  let formRef = useRef<ProFormInstance>();
  useEffect(() => {
    formRef.current?.setFieldsValue(values);
  }, [values]);

  return (
    <>
      <Modal open={visible} footer={null} onCancel={() => onCancel?.()}>
        <ProTable
          formRef={formRef}
          columns={columns}
          type={'form'}
          onSubmit={async (values) => {
            await onSubmit(values);
          }}
        />
      </Modal>
    </>
  );
};

export default UpdateModal;
