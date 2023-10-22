import { useState, useEffect } from "react";
import { Form, Input, Button, Upload, message, Select } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const EditProjectForm = ({ projectData }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    form.setFieldsValue({
      title: projectData?.title,
      budget: projectData?.budget,
      phaseStatus: projectData?.phaseStatus,
      date: projectData?.date,
    });
    setFileList(projectData?.images); // Assuming images is an array of file objects
  }, [projectData, form]);

  const onFinish = (values) => {
    // Handle form submission
    console.log("Received values:", values);
  };

  const beforeUpload = (file) => {
    setFileList([...fileList, file]); // Allow multiple files
    return false;
  };

  return (
    <div className="container w-full px-2 m-2 md:px-44 md:m-5 flex justify-center items-center">
      <Form
        layout="vertical"
        className="w-full md:w-[70%]"
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        size="large"
      >
        <h2 className="text-2xl md:text-5xl text-center font-bold mb-4 my-4">
          Edit Project
        </h2>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter a title!" }]}
          className="input-gray-900"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Budget"
          name="budget"
          rules={[{ required: true, message: "Please enter a budget!" }]}
          className="input-gray-900"
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          label="Phase Status"
          name="phaseStatus"
          rules={[{ required: true, message: "Please select a phase status!" }]}
          className="input-gray-900"
        >
          <Select placeholder="Select a Phase Status">
            <Option value="clearing">Clearing</Option>
            <Option value="foundation">Foundation</Option>
            <Option value="farming">Farming</Option>
            <Option value="finishes">Finishes</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true, message: "Please enter a date!" }]}
          className="input-gray-900"
        >
          <Input />
        </Form.Item>

        <Form.Item label="Upload Image(s)">
          <Upload beforeUpload={beforeUpload} fileList={fileList} maxCount={5}>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button className="custom-btn w-full h-full" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditProjectForm;
