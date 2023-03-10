import { Button, Form, Input } from 'antd';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { hideLoading, showLoading } from '../redux/alertsSlice';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const onFinish = async (values) => {
    try {
      setIsLoading(true);
      const response = await axios.post('https://mern-doctor-appoinment-api.onrender.com/api/user/register', values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/login');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="authentication">
      <div className="authentication-form card p-3">
        <h1 className="card-title">Group One Medical</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name' }]}>
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email' },
              {
                pattern: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
                message: 'Invalid Email',
              },
            ]}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password' }]}>
            <Input placeholder="Password" type="password" />
          </Form.Item>

          <Button
            loading={isLoading}
            className="primary-button my-2 full-width-button"
            htmlType="submit">
            REGISTER
          </Button>
          <div className="text-center">
            <Link to="/login" className="anchor mt-2">
              CLICK HERE TO LOGIN
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Register;
