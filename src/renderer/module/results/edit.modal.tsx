import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import { ipcRenderer } from "electron";
import { toast } from "react-toastify";

interface PropsModal {
  isOpen: boolean;
  toggle: any;
  data: any;
}

const EditResultModal = (props: PropsModal) => {
  const [form] = Form.useForm();
  const [targets, set_targets] = useState([]);
  const [teams, set_teams] = useState([]);
  const onRequiredTypeChange = () => {};

  const handleOk = async () => {
    let resp = await ipcRenderer.invoke("EDIT_RESULT", {
      id: form.getFieldValue("id"),
      targetId: form.getFieldValue("targetId"),
      teamId: form.getFieldValue("teamId"),
      checkPoint: form.getFieldValue("checkPoint"),
      process: form.getFieldValue("process"),
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

  const get_targets = async () => {
    let data = await ipcRenderer.invoke("GET_LIST_TARGET", true);
    let temp = data.map((item: any) => {
      return {
        value: item?.id,
        label: item?.title,
      };
    });
    set_targets(temp);
  };
  const get_teams = async () => {
    let data = await ipcRenderer.invoke("GET_LIST_TEAM", true);
    let temp = data.map((item: any) => {
      return {
        value: item?.id,
        label: item?.name,
      };
    });
    set_teams(temp);
  };

  useEffect(() => {
    get_targets();
    get_teams();
    form.setFieldValue("id", props.data.id);
    form.setFieldValue("targetId", props.data.targetId);
    form.setFieldValue("teamId", props.data.teamId);
    form.setFieldValue("checkPoint", props.data.checkPoint);
    form.setFieldValue("process", props.data.process);
  }, []);
  return (
    <>
      <Modal
        title="Chỉnh sửa kết quả"
        open={props.isOpen}
        onOk={handleOk}
        onCancel={props.toggle}
        footer={[
          <Button key="cancel" htmlType="button" onClick={props.toggle}>
            Hủy
          </Button>,
          <Button
            form="form_edit_result"
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
          id="form_edit_result"
          layout="vertical"
          initialValues={{}}
          onValuesChange={onRequiredTypeChange}
          requiredMark={false}
          onFinish={handleOk}
        >
          <Form.Item label="ID" tooltip="This is a required field" name="id">
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Chỉ tiêu"
            tooltip="This is a required field"
            name="targetId"
            rules={[
              {
                required: true,
                message: " Vui lòng chọn chỉ tiêu!",
              },
            ]}
          >
            <Select
              showSearch
              style={{ width: "100%" }}
              placeholder="Search to Select"
              optionFilterProp="children"
              filterOption={(input, option: any) =>
                (option?.label ?? "").includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={targets}
            />
          </Form.Item>
          <Form.Item
            label="Đội thực hiện"
            tooltip="This is a required field"
            name="teamId"
            rules={[
              {
                required: true,
                message: " Vui lòng chọn đội thực hiện!",
              },
            ]}
          >
            <Select
              showSearch
              style={{ width: "100%" }}
              placeholder="Search to Select"
              optionFilterProp="children"
              filterOption={(input, option: any) =>
                (option?.label ?? "").includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={teams}
            />
          </Form.Item>{" "}
          <Form.Item
            label="Tiến độ thực hiện"
            tooltip="This is a required field"
            name="process"
            rules={[
              {
                required: true,
                message: " Vui lòng nhập tiến độ thực hiện!",
              },
            ]}
          >
            <Input placeholder="Nhập tiến độ thực hiện" />
          </Form.Item>
          <Form.Item
            label="Điểm đánh giá"
            tooltip="This is a required field"
            name="checkPoint"
            rules={[
              {
                required: true,
                message: " Vui lòng nhập điểm đánh giá!",
              },
            ]}
          >
            <Input placeholder="Nhập điểm đánh giá" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditResultModal;
