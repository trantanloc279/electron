import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Select } from "antd";
import { ipcRenderer } from "electron";
import { toast } from "react-toastify";

interface PropsModal {
  isOpen: boolean;
  toggle: any;
}

const CreateResultModal = (props: PropsModal) => {
  const [form] = Form.useForm();
  const [targets, set_targets] = useState([]);
  const [teams, set_teams] = useState([]);
  const onRequiredTypeChange = () => {};

  const handleOk = async () => {
    let resp = await ipcRenderer.invoke("CREATE_RESULT", {
      targetId: form.getFieldValue("targetId"),
      teamId: form.getFieldValue("teamId"),
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
  }, []);
  return (
    <>
      <Modal
        title="Thêm kết quả"
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
                message: " Vui lòng chọn đội thực hiệ!",
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
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateResultModal;
