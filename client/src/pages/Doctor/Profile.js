// import { Button, Col, Form, Input, Row, TimePicker } from "antd";
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/alertsSlice';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import DoctorForm from '../../components/DoctorForm';
import moment from 'moment';
import { Divider } from 'antd';
// const initDoctor = {
//   _id: 1,
//   firstName: 'Trung Anh',
//   lastName: 'Trương Ngọc',
//   phoneNumber: '0909989909',
//   address: 'Ngô Gia Tự',
//   feePerCunsultation: 300000,
//   timings: ['8:00', '9:00'],
// };
function Profile() {
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const [doctor, setDoctor] = useState(null);
  // const [doctor, setDoctor] = useState(initDoctor);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        'https://mern-doctor-appoinment-api.onrender.com/api/doctor/update-doctor-profile',
        {
          ...values,
          userId: user._id,
          timings: [
            moment(values.timings[0]).format('HH:mm'),
            moment(values.timings[1]).format('HH:mm'),
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error('Something went wrong');
    }
  };

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        'https://mern-doctor-appoinment-api.onrender.com/api/doctor/get-doctor-info-by-user-id',
        {
          userId: params.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      dispatch(hideLoading());
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      console.log(error);
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);
  return (
    <Layout>
      <h1 className="page-title">My profile</h1>
      <Divider />
      {doctor && <DoctorForm onFinish={onFinish} initivalValues={doctor} />}
    </Layout>
  );
}

export default Profile;
