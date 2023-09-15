import { Tag } from 'antd';
import { keyBy } from 'lodash';
import React from 'react';

export const MethodTag: React.FC<{
  method: string;
}> = ({ method }) => {
  const METHOD_ENUM = [
    { text: 'GET', value: '0', color: 'green' },
    { text: 'POST', value: '1', color: 'blue' },
    { text: 'PUT', value: '2', color: 'orange' },
    { text: 'DELETE', value: '3', color: 'red' },
  ];

  let valueMethodDictionary = keyBy(METHOD_ENUM, 'value');
  let textMethodDictionary = keyBy(METHOD_ENUM, 'text');

  const tagStatus = valueMethodDictionary[method] ||
    textMethodDictionary[method] || { color: 'purple', text: '未知' };

  return (
    <Tag bordered={false} color={tagStatus.color}>
      {tagStatus.text}
    </Tag>
  );
};
