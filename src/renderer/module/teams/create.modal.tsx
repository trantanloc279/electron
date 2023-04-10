import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal, Radio } from 'antd';
import { ipcRenderer } from 'electron';
import { toast } from 'react-toastify';

interface PropsModal {
  isOpen: boolean;
  toggle: any;
}

const CreateTeamModal = (props: PropsModal) => {
  const [form] = Form.useForm();

  const onRequiredTypeChange = () => {};
  useEffect(() => {
    console.log('Modal', props);
  }, [props]);

  const handleOk = async () => {
    let resp = await ipcRenderer.invoke('CREATE_TEAM', {
      name: form.getFieldValue('name'),
    });
    if (resp?.id) {
      console.log('done');
      toast.success(' Thành công!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } else {
      toast.error(' Lỗi!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
    props.toggle();
  };

  return (
    <>
      <Modal
        title="Thêm đội quản lý"
        open={props.isOpen}
        onOk={handleOk}
        onCancel={props.toggle}
        footer={[
          <Button key="cancel" htmlType="button" onClick={props.toggle}>
            Hủy
          </Button>,
          <Button
            form="form_create_team"
            key="submit"
            htmlType="submit"
            type="primary"
          >
            Tạo
          </Button>,
        ]}
      >
        <Form
          form={form}
          id="form_create_team"
          layout="vertical"
          initialValues={{}}
          onValuesChange={onRequiredTypeChange}
          requiredMark={false}
          onFinish={handleOk}
        >
          <Form.Item
            label="Tên đội"
            tooltip="This is a required field"
            name="name"
            rules={[
              {
                required: true,
                message: ' Vui lòng nhập họ tên!',
              },
            ]}
          >
            <Input placeholder="Nhập tên" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateTeamModal;
