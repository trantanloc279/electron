import React, { useEffect, useState } from 'react';
import {
  Button,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
} from 'antd';
import { ipcRenderer } from 'electron';
import { toast } from 'react-toastify';
import TextArea from 'antd/es/input/TextArea';
import dayjs from 'dayjs';
import EVALUATION_METHOD from 'renderer/constant/EvaluationMethod';

const { Option } = Select;
interface PropsModal {
  isOpen: boolean;
  toggle: any;
  data: any;
}

const EditTargetModal = (props: PropsModal) => {
  const [form] = Form.useForm();
  const [method_evaluate, set_method_evaluate] = useState(0);
  const [sub_method_evaluate, set_sub_method_evaluate] = useState(0);

  const onRequiredTypeChange = () => {};

  useEffect(() => {
    console.log('Modal', props);
  }, [props]);

  useEffect(() => {
    console.log(props.data);
    form.setFieldValue('title', props.data.title);
    form.setFieldValue('id', props.data.id);
    form.setFieldValue('description', props.data.description);
    form.setFieldValue('deadline', dayjs(props.data.deadline));
    form.setFieldValue('detail', props.data.detail);
    form.setFieldValue('detailPoint', props.data.detailPoint);
    form.setFieldValue('evaluation_method', props.data.evaluationMethods);
    form.setFieldValue(
      'conditionEvaluationMethodTwo',
      props.data.conditionEvaluationMethodTwo
    );
    set_method_evaluate(props.data.evaluationMethods);
  }, []);
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);

    // form.set;
  };

  const handleOk = async () => {
    let resp = await ipcRenderer.invoke('EDIT_TARGET', {
      title: form.getFieldValue('title'),
      description: form.getFieldValue('description'),
      deadline: form.getFieldValue('deadline').toDate(),
      id: form.getFieldValue('id'),
      detail: form.getFieldValue('detail') || '',
      detailPoint: Number(form.getFieldValue('detailPoint')) || 0,
      evaluationMethods: form.getFieldValue('evaluation_method'),
      conditionEvaluationMethodTwo:
        form.getFieldValue('conditionEvaluationMethodTwo') || 0,
    });
    if (resp?.id) {
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
        title="Chỉnh sửa chỉ tiêu"
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
                message: ' Vui lòng nhập chỉ tiêu!',
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
                message: ' Vui lòng nhập chỉ tiêu!',
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
                message: ' Vui lòng nhập nội dung chỉ tiêu!',
              },
            ]}
          >
            <TextArea placeholder="Nhập nội dung chỉ tiêu" />
          </Form.Item>
          <Form.Item
            name="evaluation_method"
            label="Phương pháp đánh giá"
            rules={[{ required: true }]}
          >
            <Select onChange={(e) => set_method_evaluate(e)} allowClear>
              <Option value={EVALUATION_METHOD.METHOD_ONE}>
                Phương pháp 1
              </Option>
              <Option value={EVALUATION_METHOD.METHOD_TWO}>
                Phương pháp 2
              </Option>
              <Option value={EVALUATION_METHOD.METHOD_THREE}>
                Phương pháp 3
              </Option>
              <Option value={EVALUATION_METHOD.METHOD_FOUR}>
                Phương pháp 4
              </Option>
            </Select>
          </Form.Item>
          {method_evaluate == EVALUATION_METHOD.METHOD_ONE && (
            <Form.Item
              label="Cụ thể đánh giá"
              tooltip="This is a required field"
              name="detail"
              rules={[
                {
                  required: true,
                  message: ' Vui lòng Nhập cụ thể đánh giá!',
                },
              ]}
            >
              <TextArea placeholder="Nhập cụ thể đánh giá" />
            </Form.Item>
          )}

          {[
            EVALUATION_METHOD.METHOD_TWO,
            EVALUATION_METHOD.METHOD_THREE,
            EVALUATION_METHOD.METHOD_FOUR,
          ].includes(method_evaluate) && (
            <Form.Item
              label="Cụ thể đánh giá"
              tooltip="This is a required field"
              name="detailPoint"
              rules={[
                {
                  required: true,
                  message: ' Vui lòng Nhập cụ thể đánh giá!',
                },
              ]}
            >
              <Input placeholder="Nhập chỉ tiêu" />
            </Form.Item>
          )}

          {[EVALUATION_METHOD.METHOD_TWO].includes(method_evaluate) && (
            <Form.Item
              label="Đánh giá"
              tooltip="This is a required field"
              name="conditionEvaluationMethodTwo"
              rules={[
                {
                  required: true,
                  message: ' Vui lòng Đánh giá!',
                },
              ]}
            >
              <Select onChange={(e) => set_sub_method_evaluate(e)} allowClear>
                <Option value={1}>Trên</Option>
                <Option value={0}>Dưới</Option>
              </Select>
            </Form.Item>
          )}
          {[EVALUATION_METHOD.METHOD_FOUR].includes(method_evaluate) && (
            <Form.Item
              label="Đánh giá"
              tooltip="This is a required field"
              name="conditionEvaluationMethodTwo"
              rules={[
                {
                  required: true,
                  message: ' Vui lòng Đánh giá!',
                },
              ]}
            >
              <Select onChange={(e) => set_sub_method_evaluate(e)} allowClear>
                <Option value={2}>Bằng</Option>
                <Option value={1}>Trên</Option>
                <Option value={0}>Dưới</Option>
              </Select>
            </Form.Item>
          )}

          <Form.Item
            label="Ngày cuối thực hiện"
            tooltip="This is a required field"
            name="deadline"
            rules={[
              {
                required: true,
                message: ' Vui lòng nhập ngày chốt sổ!',
              },
            ]}
          >
            <DatePicker onChange={onChange} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditTargetModal;
