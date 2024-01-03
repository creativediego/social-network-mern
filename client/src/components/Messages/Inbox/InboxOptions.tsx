import React, { memo } from 'react';
import { IMessage } from '../../../interfaces/IMessage';
import {
  OptionItem,
  OptionMenuProvider,
} from '../../OptionMenu/OptionMenuProvider';
import { OptionMenu } from '../..';
import { useInboxActions } from './hooks/useInboxActions';

interface MessageOptionsProps {
  message: IMessage;
}

const InboxOptions = ({ message }: MessageOptionsProps): JSX.Element => {
  const { handleDelete } = useInboxActions(message);

  const options: OptionItem[] = [
    {
      label: 'Delete chat',
      icon: 'fa-trash-can',
      color: 'danger',
      action: () => handleDelete(),
    },
  ];

  return (
    <OptionMenuProvider>
      <OptionMenu customOptions={options} />
    </OptionMenuProvider>
  );
};

export default memo(InboxOptions);
