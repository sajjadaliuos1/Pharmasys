import React, { useState, useEffect } from 'react';
import { Select, Avatar, Spin } from 'antd';
import axios from 'axios';

const { Option } = Select;

const CustomSelect = ({ value, onChange }) => {
  const [selectedValue, setSelectedValue] = useState(value);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://pos.idotsolution.com/api/Product/productItems');
        if (response.data && Array.isArray(response.data.data)) {
          setProducts(response.data.data);
        } else {
          console.error('Invalid API response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (value) => {
    setSelectedValue(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Select
      showSearch
      placeholder="Search a product"
      optionFilterProp="label"
      style={{ width: '100%' }}
      value={selectedValue}
      onChange={handleChange}
      filterOption={(input, option) =>
        option?.label?.toLowerCase().includes(input.toLowerCase())
      }
      optionLabelProp="label"
      notFoundContent={loading ? <Spin size="small" /> : 'No products found'}
    >
      {products.map(product => (
        <Option
          key={product.productId}
          value={product.productId}
          label={product.productName} // for filtering and display when selected
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              size="small" 
              style={{ marginRight: 8, backgroundColor: getAvatarColor(product.productId) }}
            >
              {product.productName.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <div style={{ fontWeight: 500 }}>{product.productName}</div>
              <div style={{ fontSize: 12, color: 'gray' }}>
              Quantity: {product.quantity} {product.uom} | Price: {product.saleRate.toFixed(2)}
              </div>
            </div>
          </div>
        </Option>
      ))}
    </Select>
  );
};

// Helper function to generate consistent colors based on ID
const getAvatarColor = (id) => {
  const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'];
  return colors[id % colors.length];
};

export default CustomSelect;