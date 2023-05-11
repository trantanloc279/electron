import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Select } from 'antd';
import { ipcRenderer } from 'electron';
import { toast } from 'react-toastify';
import EVALUATION_METHOD from 'renderer/constant/EvaluationMethod';
import TextArea from 'antd/es/input/TextArea';
import RESULT_STATUS from 'renderer/constant/ResultStatus';

interface PropsModal {
  isOpen: boolean;
  toggle: any;
  data: any;
}
const { Option } = Select;
const EditResultModal = (props: PropsModal) => {
  const [form] = Form.useForm();
  const [targets, set_targets] = useState([]);
  const [teams, set_teams] = useState([]);
  const onRequiredTypeChange = () => {};

  const handleOk = async () => {
    let resp = await ipcRenderer.invoke('EDIT_RESULT', {
      id: form.getFieldValue('id'),
      targetId: form.getFieldValue('targetId'),
      teamId: form.getFieldValue('teamId'),
      result: form.getFieldValue('result') || '',
      resultPoint: form.getFieldValue('resultPoint') || 0,
      status: form.getFieldValue('evaluate') || 0,
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

  const get_targets = async () => {
    let data = await ipcRenderer.invoke('GET_LIST_TARGET', true);
    let temp = data.map((item: any) => {
      return {
        value: item?.id,
        label: item?.title,
      };
    });
    set_targets(temp);
  };
  const get_teams = async () => {
    let data = await ipcRenderer.invoke('GET_LIST_TEAM', true);
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
    form.setFieldValue('id', props.data.id);
    form.setFieldValue('targetId', props.data.targetId);
    form.setFieldValue('teamId', props.data.teamId);
    // form.setFieldValue('checkPoint', props.data.checkPoint);
    form.setFieldValue('result', props.data.result);
    form.setFieldValue('resultPoint', props.data.resultPoint);
    form.setFieldValue(
      'evaluation_method',
      props.data.target.evaluationMethods
    );
    form.setFieldValue(
      'conditionEvaluationMethodTwo',
      props.data.target.conditionEvaluationMethodTwo
    );
    console.log({ data: props.data });
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
                message: ' Vui lòng chọn chỉ tiêu!',
              },
            ]}
          >
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Search to Select"
              optionFilterProp="children"
              filterOption={(input, option: any) =>
                (option?.label ?? '').includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? '').toLowerCase())
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
                message: ' Vui lòng chọn đội thực hiện!',
              },
            ]}
          >
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Search to Select"
              optionFilterProp="children"
              filterOption={(input, option: any) =>
                (option?.label ?? '').includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? '').toLowerCase())
              }
              options={teams}
            />
          </Form.Item>
          <Form.Item
            name="evaluation_method"
            label="Phương pháp đánh giá"
            rules={[{ required: true }]}
          >
            <Select onChange={(e) => console.log({ e })} allowClear disabled>
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
          {[
            EVALUATION_METHOD.METHOD_TWO,
            EVALUATION_METHOD.METHOD_THREE,
          ].includes(props.data.target.evaluationMethods) && (
            <Form.Item
              label="Điểm đánh giá"
              tooltip="This is a required field"
              name="resultPoint"
              rules={[
                {
                  required: true,
                  message: ' Vui lòng nhập điểm đánh giá!',
                },
              ]}
            >
              <InputNumber placeholder="Nhập điểm đánh giá" />
            </Form.Item>
          )}
          {[EVALUATION_METHOD.METHOD_TWO].includes(
            props.data.target.evaluationMethods
          ) && (
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
              <Select allowClear disabled>
                <Option value={1}>Trên</Option>
                <Option value={0}>Dưới</Option>
              </Select>
            </Form.Item>
          )}

          {[EVALUATION_METHOD.METHOD_ONE].includes(
            props.data.target.evaluationMethods
          ) && (
            <Form.Item
              label="Kết quả"
              tooltip="This is a required field"
              name="result"
              rules={[
                {
                  required: true,
                  message: ' Vui lòng nhập kết quả đánh giá!',
                },
              ]}
            >
              <TextArea placeholder="Nhập kết quả đánh giá" />
            </Form.Item>
          )}

          {[
            EVALUATION_METHOD.METHOD_ONE,
            EVALUATION_METHOD.METHOD_FOUR,
          ].includes(props.data.target.evaluationMethods) && (
            <Form.Item name="evaluate" label="Đánh giá">
              <Select onChange={(e) => console.log({ e })} allowClear>
                <Option value={RESULT_STATUS.SUCCESS}>Đạt yêu cầu</Option>
                <Option value={RESULT_STATUS.FAILED}>Không đạt</Option>
                {[EVALUATION_METHOD.METHOD_THREE].includes(
                  props.data.target.evaluationMethods
                ) && <Option value={RESULT_STATUS.GOOD}>Vươt yêu cầu</Option>}
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default EditResultModal;
