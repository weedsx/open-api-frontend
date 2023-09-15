import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

const CreateModal: React.FC<{
  onCancel: (flag?: boolean) => void;
  onSubmit: (values: API.InterfaceInfoAddRequest) => Promise<void>;
  visible: boolean;
  columns: ProColumns<API.InterfaceInfo>[];
}> = ({ visible, onCancel, onSubmit, columns }) => {
  return (
    <>
      <Modal open={visible} footer={null} onCancel={() => onCancel?.()}>

        <ProTable
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

export default CreateModal;
