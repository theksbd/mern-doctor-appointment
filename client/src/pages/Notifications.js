import { Button, Divider, Segmented, Tabs } from 'antd';
import axios from 'axios';
import React, { Fragment, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { hideLoading, showLoading } from '../redux/alertsSlice';
import { setUser } from '../redux/userSlice';

function Notifications() {
  const { user } = useSelector((state) => state.user);
  const [currentTab, setCurrentTab] = useState('Unseen');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const markAllAsSeen = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        'https://mern-doctor-appoinment-api.onrender.com/api/user/mark-all-notifications-as-seen',
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error('Something went wrong');
    }
  };

  const deleteAll = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        'https://mern-doctor-appoinment-api.onrender.com/api/user/delete-all-notifications',
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error('Something went wrong');
    }
  };
  return (
    <Layout>
      <h1 className="page-title">Notifications</h1>
      <Divider />
      <Segmented
        block
        size="large"
        options={['Unseen', 'Seen']}
        value={currentTab}
        onChange={(e) => {
          setCurrentTab(e);
        }}
      />
      {currentTab === 'Unseen' ? (
        <Fragment>
          <div className="d-flex justify-content-end">
            <Button type="primary" onClick={() => markAllAsSeen()}>
              Mark all as seen
            </Button>
          </div>
          {user?.unseenNotifications.map((notification, index) => (
            <div
              className="card p-2 mt-2"
              key={index}
              onClick={() => navigate(notification.onClickPath)}>
              <div className="card-text">{notification.message}</div>
            </div>
          ))}
        </Fragment>
      ) : (
        <Fragment>
          {user?.seenNotifications.map((notification, index) => (
            <div
              key={index}
              className="card p-2 mt-2"
              onClick={() => navigate(notification.onClickPath)}>
              <div className="card-text">{notification.message}</div>
            </div>
          ))}
        </Fragment>
      )}
    </Layout>
  );
}

export default Notifications;
