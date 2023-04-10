import React, { useEffect } from "react";
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

interface PropsModal {
  isOpen: boolean;
  toggle: any;
}

const CreateTargetModal = (props: PropsModal) => {
  const [form] = Form.useForm();

  const onRequiredTypeChange = () => {};
  useEffect(() => {
    console.log("Modal", props);
  }, [props]);

  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  const handleOk = async () => {
    // return;
    let resp = await ipcRenderer.invoke("CREATE_TARGET", {
      title: form.getFieldValue("title"),
      description: form.getFieldValue("description"),
      deadline: form.getFieldValue("deadline").toDate(),
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
        title="Thêm chỉ tiêu"
        open={props.isOpen}
        onOk={handleOk}
        onCancel={props.toggle}
        footer={[
          <Button key="cancel" htmlType="button" onClick={props.toggle}>
            Hủy
          </Button>,
          <Button
            form="form_create_target"
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
          id="form_create_target"
          layout="vertical"
          initialValues={{}}
          onValuesChange={onRequiredTypeChange}
          requiredMark={false}
          onFinish={handleOk}
        >
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

export default CreateTargetModal;
