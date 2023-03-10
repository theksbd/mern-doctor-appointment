import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Col, Row, Select, Input, Button, Form, Table, Space } from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import Doctor from '../components/Doctor';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../redux/alertsSlice';
import { useNavigate } from 'react-router-dom';
import {
  formatProductPrice,
  includeSubString,
  removeVietnameseTones,
} from '../helpers';

let initDoctor = [];
const { Option } = Select;
const columns = [
  {
    title: 'Name',
    dataIndex: 'firstName',
    key: 'name',
    render: (text, record, index) => {
      return record.lastName + ' ' + text;
    },
  },
  {
    title: 'Specialization',
    dataIndex: 'specialization',
    key: 'specialization'
  },
  {
    title: 'Phone',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Cunsultation Price',
    dataIndex: 'feePerCunsultation',
    key: 'feePerCunsultation',
    render: (text) => `${formatProductPrice(text, 'USD')}`,
  },
  {
    title: 'Timmings',
    dataIndex: 'timings',
    key: 'timings',
    render: (value, record, index) => `${value[0] + ' - ' + value[1]}`,
  },
];

let timeOutCode;
function Home() {
  // const [doctors, setDoctors] = useState([]);
  const [doctors, setDoctors] = useState(initDoctor);
  const [isLoading, setIsLoading] = useState(false);
  const [searchOption, setSearchOption] = useState({
    type: '1',
    value: '',
  });
  const navigate = useNavigate();
  const getData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('https://mern-doctor-appoinment-api.onrender.com/api/user/get-all-approved-doctors', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      });
      setIsLoading(false);
      if (response.data.success) {
        initDoctor =response.data.data;
        setDoctors(response.data.data);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const onSearch = () => {
    let result = [];
    setIsLoading(true);
    timeOutCode = setTimeout(() => {
      initDoctor.forEach((item) => {
        if (
          includeSubString(
            removeVietnameseTones(item.firstName),
            searchOption.value
          ) ||
          includeSubString(
            removeVietnameseTones(item.lastName),
            searchOption.value
          )
        ) {
          result.push({ ...item });
        }
      });
      setDoctors(result);
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    getData();
    return () => {
      if (timeOutCode) {
        clearTimeout(timeOutCode);
      }
    };
  }, []);

  return (
    <Layout>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form>
            <Input.Group compact>
              <Select
                defaultValue="1"
                style={{ height: '100%', width: '100px' }}
                onChange={(type) => {
                  setSearchOption((prev) => {
                    prev.type = type;
                    return { ...prev };
                  });
                }}>
                <Option value="1">All</Option>
              </Select>
              <Input
                size="small"
                style={{ width: '400px' }}
                onPressEnter={onSearch}
                placeholder="Search ..."
                onChange={(e) => {
                  setSearchOption((prev) => {
                    prev.value = e.target.value;
                    return { ...prev };
                  });
                }}
              />
              <Button
                onClick={onSearch}
                type="primary"
                style={{ height: 40 }}
                className="primary-button">
                Search
              </Button>
            </Input.Group>
          </Form>
        </Col>
        <Col span={24}>
          <Table
            loading={isLoading}
            columns={columns}
            rowKey="_id"
            dataSource={doctors}
            pagination={false}
            rowClassName={() => `cursor-pointer`}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  navigate(`/book-appointment/${record._id}`);
                }, // click row
              };
            }}
          />
        </Col>
      </Row>
    </Layout>
  );
}

export default Home;
