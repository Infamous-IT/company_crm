import type { FormProps } from "antd";
import { Button, Checkbox, Form, Input, Typography } from "antd";
import { toast } from "react-toastify";
import useApi from "../hooks/useApi.ts";
import { useAuth } from "../hooks/useAuth.tsx";

type FieldType = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: boolean;
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const Auth = () => {
  const api = useApi();
  const auth = useAuth();
  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    console.log("Success:", values);
    const response = await api.register({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      role: values.role ? "DOCTOR" : "PATIENT",
    });
    if (response.data.token) {
      auth.signIn(response.data.token);
    }
    toast.success("Successfully registration!");
    window.location.reload();
  };

  return (
      <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
      >
        <Typography.Title style={{ textAlign: "center" }}>
          Sign up
        </Typography.Title>
        <Form.Item<FieldType>
            label="First name"
            name="firstName"
            rules={[{ required: true, message: "Please input your first name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
            label="Last name"
            name="lastName"
            rules={[{ required: true, message: "Please input your last name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
            name="role"
            valuePropName="checked"
            wrapperCol={{ offset: 8, span: 16 }}
        >
          <Checkbox>You are doctor?</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
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
