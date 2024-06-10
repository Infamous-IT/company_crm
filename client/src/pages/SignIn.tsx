import {Button, Form, FormProps, Input, message, Tag, Typography} from "antd";
import React, {useState} from "react";
import useApi from "../hooks/useApi.ts";
import { useAuth } from "../hooks/useAuth.tsx";
import {CredentialResponse, GoogleLogin} from "@react-oauth/google";

type FieldType = {
    email: string;
    password: string;
};

type RequiredMark = boolean | 'optional' | 'customize';

const customizeRequiredMark = (label: React.ReactNode, { required }: { required: boolean }) => (
    <>
        {required ? <Tag color="error">Required</Tag> : <Tag color="warning">optional</Tag>}
        {label}
    </>
);

const SignIn: React.FC = () => {
    const auth = useAuth();
    const api = useApi();
    const [form] = Form.useForm();
    const [requiredMark, setRequiredMarkType] = useState<RequiredMark>('optional');
    const [messageApi, contextHolder] = message.useMessage();

    const success = () => {
        messageApi.open({
            type: 'success',
            content: 'You have successfully log in in system',
            duration: 5
        });
    };

    const error = () => {
        messageApi.open({
            type: 'error',
            content: 'Something went wrong!',
            duration: 5
        });
    };

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        console.log("Success:", values);
        try {
            const response = await api.login({
                email: values.email,
                password: values.password,
            });

            if (response.token) {
                auth.signIn(response.token);
            }
            success();
        } catch (e) {
            console.log(e);
        }
    };

    const onGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            const response = await api.googleLogin({token: credentialResponse.credential!})
            console.log(response);
            auth.signIn(response.token);
            success();
        } catch (e) {
            console.error("Google login failed", e);
            error();
        }
    };

    const onRequiredTypeChange = ({ requiredMarkValue }: { requiredMarkValue: RequiredMark }) => {
        setRequiredMarkType(requiredMarkValue);
    };

    const onGoogleFailure = () => {
        error();
    };

    return (
        <Form
            name="basic"
            form={form}
            layout="vertical"
            labelCol={{ span: 12 }}
            wrapperCol={{ span: 18 }}
            initialValues={{ requiredMarkValue: requiredMark }}
            onValuesChange={onRequiredTypeChange}
            onFinish={onFinish}
            onFinishFailed={error}
            requiredMark={requiredMark === 'customize' ? customizeRequiredMark : requiredMark}
        >
            {contextHolder}
            <Typography.Title style={{ textAlign: "center" }}>
                Sign in
            </Typography.Title>
            <Form.Item style={{display: "flex", justifyContent: "center"}}>
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
                    Log in
                </Button>
                <Typography.Text style={{ marginLeft: 15 }}>
                    Or <a href="/auth">register now!</a>
                </Typography.Text>
                <div style={{
                    display: "flex",
                    marginTop: 10
                }}>
                    <GoogleLogin
                        onSuccess={onGoogleSuccess}
                        onError={onGoogleFailure}
                    />
                </div>
            </Form.Item>
        </Form>
    );
};

export default SignIn;
