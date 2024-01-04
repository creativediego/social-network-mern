import React, { memo } from 'react';
import { IMessage } from '../../../../interfaces/IMessage';
import {
  OptionItem,
  OptionMenuProvider,
} from '../../../OptionMenu/OptionMenuProvider';
import { OptionMenu } from '../../..';
import useChatMessageOptions from './useChatMessageOptions';

/**
 * MessageOptionsProps interface.
 *
 * @interface
 * @property {IMessage} message - The message object.
 */
interface MessageOptionsProps {
  message: IMessage;
}

const MessageOptions = ({ message }: MessageOptionsProps): JSX.Element => {
  const { handleDelete } = useChatMessageOptions(message);

  const options: OptionItem[] = [
    {
      label: 'Delete',
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

export default memo(MessageOptions);
