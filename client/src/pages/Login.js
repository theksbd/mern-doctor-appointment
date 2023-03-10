import { Button, Form, Input, message } from 'antd';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import { setUser } from '../redux/userSlice';
function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      console.log(values);
      const response = await axios.post('https://mern-doctor-appoinment-api.onrender.com/api/user/login', values);
      dispatch(hideLoading());
      if (response.data.success) {
        message.success(response.data.message);
        localStorage.setItem('token', response.data.data);
        navigate('/');
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error('Something went wrong');
    }
  };
  useEffect(()=>{
    dispatch(setUser(null));
  },[]);
  return (
    <div className="authentication">
      <div className="authentication-form card p-3">
        <h1 className="card-title">Group One Medical</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
            ]}>
            <Input placeholder="Password" type="password" />
          </Form.Item>

          <Button
            className="primary-button my-2 full-width-button"
            htmlType="submit">
            LOGIN
          </Button>
          <div className="text-center">
            <Link to="/register" className="anchor mt-2">
              Or register now!
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default Login;
