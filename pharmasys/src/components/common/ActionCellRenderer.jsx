import React from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip, message, Space } from 'antd';

const ActionCellRenderer = ({
  data,
  onEdit,
  onDelete,
  isUpdate,
  editTooltip = "Edit",
  deleteTooltip = "Delete",
  deleteConfirmText = "Are you sure you want to delete this item?"
}) => {
  const handleDelete = () => {
    onDelete(data);
    message.success('Deleted successfully');
  };

  return (
    <Space size="small">

        <div style={{ display: isUpdate ? 'block' : 'none' }}>
        <Tooltip title={editTooltip}>
        <Button
          type="text"
          size="small"
          icon={<EditOutlined style={{ color: '#1890ff' }} />}
          onClick={() => onEdit(data)}
        />
      </Tooltip>
        </div>
      
      <Popconfirm
        title={deleteConfirmText}
        onConfirm={handleDelete}
        okText="Yes"
        cancelText="No"
      >
        <Tooltip title={deleteTooltip}>
          <Button
            type="text"
            size="small"
            icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
          />
        </Tooltip>
      </Popconfirm>
    </Space>
  );
};

export default ActionCellRenderer;