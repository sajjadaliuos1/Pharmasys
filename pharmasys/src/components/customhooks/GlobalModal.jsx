import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Button,
  Switch,
  InputNumber,
  Checkbox,
  Radio,
  Slider,
  Rate
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;

const GlobalModal = ({
  visible,
  title,
  onOk,
  onCancel,
  initialValues = {},
  fields = [],
  width = 520,
  okText = 'Submit',
  cancelText = 'Cancel',
}) => {
  const [form] = Form.useForm();
  const [extraDetails, setExtraDetails] = useState(''); // <-- New for showing details

  // Reset form when modal opens/closes or initialValues change
  useEffect(() => {
    if (visible) {
      form.resetFields();
      form.setFieldsValue(initialValues);
      setExtraDetails(''); // reset extra details on modal open
    }
  }, [visible, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const renderFormField = (field) => {
    const { type = 'input', options, props = {} } = field;

    switch (type.toLowerCase()) {
      case 'input':
        return <Input {...props} />;

      case 'textarea':
        return <TextArea rows={4} {...props} />;

      case 'number':
        return <InputNumber style={{ width: '100%' }} {...props} />;

      case 'password':
        return <Input.Password {...props} />;

      case 'select':
        return (
          <Select
            placeholder="Please select"
            {...props}
            onChange={(value) => {
              form.setFieldValue(field.name, value);
              if (field.onChange) field.onChange(value, form, setExtraDetails);
            }}
          >
            {options?.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );

      case 'datepicker':
        return <DatePicker style={{ width: '100%' }} {...props} />;

      case 'rangepicker':
        return <RangePicker style={{ width: '100%' }} {...props} />;

      case 'switch':
        return <Switch {...props} />;

      case 'checkbox':
        return <Checkbox {...props}>{field.label}</Checkbox>;

      case 'checkboxgroup':
        return (
          <Checkbox.Group {...props}>
            {options?.map(option => (
              <Checkbox key={option.value} value={option.value}>
                {option.label}
              </Checkbox>
            ))}
          </Checkbox.Group>
        );

      case 'radio':
        return (
          <Radio.Group {...props}>
            {options?.map(option => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </Radio.Group>
        );

      case 'slider':
        return <Slider {...props} />;

      case 'rate':
        return <Rate {...props} />;

      case 'upload':
        return (
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        );

      case 'imagepicker':
        return (
          <Upload listType="picture-card" {...props}>
            <div>
              <UploadOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        );

      default:
        return <Input {...props} />;
    }
  };

  return (
    <Modal
      open={visible}
      title={title}
      onOk={handleOk}
      onCancel={onCancel}
      destroyOnClose
      width={width}
      okText={okText}
      cancelText={cancelText}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        {fields.map((field) => (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.showLabel !== false ? field.label : null}
            rules={field.rules}
            valuePropName={
              ['switch', 'checkbox'].includes(field.type?.toLowerCase())
                ? 'checked'
                : 'value'
            }
            getValueFromEvent={
              field.type?.toLowerCase() === 'upload'
                ? (e) => (Array.isArray(e) ? e : e?.fileList)
                : undefined
            }
          >
            {field.component || renderFormField(field)}
          </Form.Item>
        ))}

        {/* Show extra details here if available */}
        {extraDetails && (
          <div style={{ marginTop: 16, padding: 10, backgroundColor: '#f6f6f6', borderRadius: 4 }}>
            <strong>Details:</strong>
            <div>{extraDetails}</div>
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default GlobalModal;
