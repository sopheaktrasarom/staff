import { FieldType } from "@/types/fieldType";
import { Button, Modal, Form, Input, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
interface IProps {
  handleCancel: () => void;
  isModalOpen: boolean;
  isLoadingCreate: boolean;
  handleSubmit: (values: FieldType) => void;
  currentStaff: FieldType;
  setCurrentStaff: (valueToEdit: FieldType) => void;
}
export default function ModalAction(props: IProps) {
  const {
    handleCancel,
    isModalOpen,
    isLoadingCreate,
    handleSubmit,
    currentStaff,
    setCurrentStaff,
  } = props;
  const [form] = Form.useForm();
  const lengthOfCurrentStaff = Object.keys(currentStaff).length;
  useEffect(() => {
    if (isModalOpen && lengthOfCurrentStaff > 0) {
      form.setFieldsValue({
        ...currentStaff,
        birthDate: dayjs(currentStaff?.birthDate),
      });
    }
    if (isModalOpen && lengthOfCurrentStaff == 0) {
      form.resetFields();
    }
  }, [isModalOpen, currentStaff]);
  function handleClose() {
    handleCancel();
    setCurrentStaff({} as FieldType);

    if (lengthOfCurrentStaff == 0) {
      form.resetFields();
    }
  }
  function validateStaffAge(_: any, value: any) {
    const today = dayjs();
    const birthDate = dayjs(value);
    const age = today.diff(birthDate, "year");

    if (!value) {
      return Promise.reject(new Error("Please input Staff birthday"));
    }

    if (age < 18 || age > 60) {
      return Promise.reject(new Error("Staff age must be between 18 and 60"));
    }

    return Promise.resolve();
  }
  return (
    <Modal
      onCancel={handleClose}
      title={lengthOfCurrentStaff > 0 ? "Edit Staff" : "Creat Staff"}
      open={isModalOpen}
      footer={null}
      destroyOnClose={true}
    >
      <Form
        name="basic"
        layout="vertical"
        form={form}
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
      >
        <Form.Item<FieldType>
          label="FullName"
          name="fullName"
          rules={[{ required: true, message: "Please input Staff full name!" }]}
        >
          <Input maxLength={100} placeholder="Enter Staff Full name" />
        </Form.Item>
        <Form.Item
          className="w-full"
          label="Birthday"
          name="birthDate"
          rules={[
            { required: true, message: "" },
            { validator: validateStaffAge },
          ]}
        >
          <DatePicker placeholder="Enter Staff birthDay" className="w-full" />
        </Form.Item>
        <Form.Item
          className="w-full"
          label="Enter Staff gender"
          name="gender"
          rules={[{ required: true, message: "Please input Staff gender!" }]}
        >
          <Select placeholder="Enter Gender" allowClear>
            <Select.Option value={1}>Male</Select.Option>
            <Select.Option value={2}>Female</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button loading={isLoadingCreate} type="primary" htmlType="submit">
            {lengthOfCurrentStaff > 0 ? "Update" : "Create"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
