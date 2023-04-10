import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Radio } from "antd";
import { ipcRenderer } from "electron";
import { toast } from "react-toastify";

interface PropsModal {
  isOpen: boolean;
  toggle: any;
  data: any;
}

const EditTeamModal = (props: PropsModal) => {
  const [form] = Form.useForm();

  const onRequiredTypeChange = () => {};
  useEffect(() => {
    console.log("Modal", props);
  }, [props]);

  useEffect(() => {
    form.setFieldValue("name", props.data.name);
    form.setFieldValue("id", props.data.id);
  }, []);

  const handleOk = async () => {
    let resp = await ipcRenderer.invoke("EDIT_TEAM", {
      name: form.getFieldValue("name"),
      id: form.getFieldValue("id"),
    });
    if (resp?.id) {
      console.log("done");
      toast.success(" Thành công!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      toast.error(" Lỗi!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
    props.toggle();
  };

  return (
    <>
      <Modal
        title="Chỉnh sửa đội quản lý"
        open={props.isOpen}
        onOk={handleOk}
        onCancel={props.toggle}
        footer={[
          <Button key="cancel" htmlType="button" onClick={props.toggle}>
            Hủy
          </Button>,
          <Button
            form="form_edit_team"
            key="submit"
            htmlType="submit"
            type="primary"
          >
            Chỉnh sửa
          </Button>,
        ]}
      >
        <Form
          form={form}
          id="form_edit_team"
          layout="vertical"
          initialValues={{}}
          onValuesChange={onRequiredTypeChange}
          requiredMark={false}
          onFinish={handleOk}
        >
          <Form.Item
            label="ID đội"
            name="id"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder="ID...." disabled />
          </Form.Item>
          <Form.Item
            label="Tên đội"
            tooltip="This is a required field"
            name="name"
            rules={[
              {
                required: true,
                message: " Vui lòng nhập họ tên!",
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

export default EditTeamModal;
