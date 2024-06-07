import { Button, Form, FormProps, Input, Typography } from "antd";
import React from "react";
import { toast } from "react-toastify";
import useApi from "../hooks/useApi.ts";
import { useAuth } from "../hooks/useAuth.tsx";
import {CredentialResponse, GoogleLogin} from "@react-oauth/google";

type FieldType = {
    email: string;
    password: string;
};

const SignIn: React.FC = () => {
    const auth = useAuth();
    const api = useApi();

    const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
        console.log("Success:", values);
        try {
            const response = await api.login({
                email: values.email,
                password: values.password,
            });

            if (response.token) {
                auth.signIn(response.token);
                toast.success("Successfully logged in!");
            }
        } catch (e) {
            console.log(e);
        }
    };

    const onGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        try {
            const response = await api.googleLogin({token: credentialResponse.credential!})
            console.log(response);
            auth.signIn(response.token)

        } catch (e) {
            console.error("Google login failed", e);
            toast.error("Google login failed");
        }
    };

    const onGoogleFailure = () => {
        toast.error("Google login failed");
    };

    return (
        <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
        >
            <Typography.Title style={{ textAlign: "center" }}>
                Sign in
            </Typography.Title>
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

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    Log in
                </Button>
                <Typography.Text style={{ marginLeft: 15 }}>
                    Or <a href="/auth">register now!</a>
                </Typography.Text>
                <div style={{marginTop: 10}}>
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
