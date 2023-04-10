import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  Modal,
  Radio,
} from "antd";
import { ipcRenderer } from "electron";
import { toast } from "react-toastify";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";

interface PropsModal {
  isOpen: boolean;
  toggle: any;
  data: any;
}

const EditTargetModal = (props: PropsModal) => {
  const [form] = Form.useForm();

  const onRequiredTypeChange = () => {};

  useEffect(() => {
    console.log("Modal", props);
  }, [props]);

  useEffect(() => {
    form.setFieldValue("title", props.data.title);
    form.setFieldValue("id", props.data.id);
    form.setFieldValue("description", props.data.description);
    form.setFieldValue("deadline", dayjs(props.data.deadline));
  }, []);
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);

    // form.set;
  };

  const handleOk = async () => {
    let resp = await ipcRenderer.invoke("EDIT_TARGET", {
      title: form.getFieldValue("title"),
      description: form.getFieldValue("description"),
      deadline: form.getFieldValue("deadline").toDate(),
      id: form.getFieldValue("id"),
    });
    if (resp?.id) {
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
        title="Chỉnh sữa chỉ tiêu"
        open={props.isOpen}
        onOk={handleOk}
        onCancel={props.toggle}
        footer={[
          <Button key="cancel" htmlType="button" onClick={props.toggle}>
            Hủy
          </Button>,
          <Button
            form="form_edit_target"
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
          id="form_edit_target"
          layout="vertical"
          initialValues={{}}
          onValuesChange={onRequiredTypeChange}
          requiredMark={false}
          onFinish={handleOk}
        >
          <Form.Item
            label="ID"
            tooltip="This is a required field"
            name="id"
            rules={[
              {
                required: true,
                message: " Vui lòng nhập chỉ tiêu!",
              },
            ]}
          >
            <Input placeholder="Nhập chỉ tiêu" disabled />
          </Form.Item>
          <Form.Item
            label="Chỉ tiêu"
            tooltip="This is a required field"
            name="title"
            rules={[
              {
                required: true,
                message: " Vui lòng nhập chỉ tiêu!",
              },
            ]}
          >
            <Input placeholder="Nhập chỉ tiêu" />
          </Form.Item>
          <Form.Item
            label="Nội dung chỉ tiêu"
            tooltip="This is a required field"
            name="description"
            rules={[
              {
                required: true,
                message: " Vui lòng nhập nội dung chỉ tiêu!",
              },
            ]}
          >
            <TextArea placeholder="Nhập nội dung chỉ tiêu" />
          </Form.Item>

          <Form.Item
            label="Ngày cuối thực hiện"
            tooltip="This is a required field"
            name="deadline"
            rules={[
              {
                required: true,
                message: " Vui lòng nhập ngày chốt sổ!",
              },
            ]}
          >
            <DatePicker onChange={onChange} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditTargetModal;
