import type { FormProps } from "antd";
import {Button, Form, Input, message, Tag, Typography} from "antd";
import useApi from "../hooks/useApi.ts";
import { useAuth } from "../hooks/useAuth.tsx";
import {useState} from "react";

type FieldType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: boolean;
};

type RequiredMark = boolean | 'optional' | 'customize';

const customizeRequiredMark = (label: React.ReactNode, { required }: { required: boolean }) => (
    <>
      {required ? <Tag color="error">Required</Tag> : <Tag color="warning">optional</Tag>}
      {label}
    </>
);

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const Auth = () => {
  const api = useApi();
  const auth = useAuth();
  const [form] = Form.useForm();
  const [requiredMark, setRequiredMarkType] = useState<RequiredMark>('optional');
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'You have successfully registered in the system',
      duration: 5
    });
  };

  const onRequiredTypeChange = ({ requiredMarkValue }: { requiredMarkValue: RequiredMark }) => {
    setRequiredMarkType(requiredMarkValue);
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    console.log("Success:", values);
    const response = await api.register({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      role: values.role ? "ADMIN" : "USER",
    });
    if (response.data.token) {
      auth.signIn(response.data.token);
    }
    success();
    window.location.reload();
  };

  return (
        <Form
            form={form}
            layout="vertical"
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ requiredMarkValue: requiredMark }}
            onValuesChange={onRequiredTypeChange}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            requiredMark={requiredMark === 'customize' ? customizeRequiredMark : requiredMark}
        >
          {contextHolder}
        <Typography.Title style={{ textAlign: "center" }}>
          Sign up
        </Typography.Title>
        <Form.Item style={{display: "flex", justifyContent: "center"}}>
            <Form.Item<FieldType>
                tooltip="This is a required field"
                label="First name"
                name="firstName"
                rules={[{ required: true, message: "Please input your first name!" }]}
                style={{ width: "400px" }}
            >
              <Input />
            </Form.Item>
            <Form.Item<FieldType>
                tooltip="This is a required field"
                label="Last name"
                name="lastName"
                rules={[{ required: true, message: "Please input your last name!" }]}
                style={{ width: "400px" }}
            >
              <Input />
            </Form.Item>
            <Form.Item<FieldType>
                tooltip="This is a required field"
                label="Email"
                name="email"
                rules={[{ required: true, message: "Please input your email!" }]}
                style={{ width: "400px" }}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
                tooltip="This is a required field"
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please input your password!" }]}
                style={{ width: "400px" }}
            >
              <Input.Password />
            </Form.Item>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 10, span: 18 }}>
          <Button type="primary" htmlType="submit" onClick={success}>
            Submit
          </Button>

          <Typography.Text style={{ marginLeft: 15 }}>
            Or <a href="/auth/sign-in">login now</a>!
          </Typography.Text>
        </Form.Item>
      </Form>
  );
};

export default Auth;
