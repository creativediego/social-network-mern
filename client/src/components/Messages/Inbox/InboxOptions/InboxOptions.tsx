import React, { memo } from 'react';
import { IMessage } from '../../../../interfaces/IMessage';
import {
  OptionItem,
  OptionMenuProvider,
} from '../../../OptionMenu/OptionMenuProvider';
import { OptionMenu } from '../../..';
import { useInboxOptions } from './useInboxOptions';

/**
 * MessageOptionsProps interface.
 *
 * @interface
 * @property {IMessage} message - The message object.
 */
interface MessageOptionsProps {
  message: IMessage;
}

/**
 * InboxOptions component.
 *
 * This component provides options for a specific message in the inbox.
 * It uses the `useInboxActions` hook to get the `handleDelete` function,
 * which is used to delete the message.
 *
 * The options are provided to the `OptionMenu` component through the `customOptions` prop.
 *
 * @param {MessageOptionsProps} props - The props.
 * @param {IMessage} props.message - The message object.
 * @returns {JSX.Element} The rendered `OptionMenu` component wrapped in an `OptionMenuProvider`.
 */
const InboxOptions = ({ message }: MessageOptionsProps): JSX.Element => {
  const { handleDelete } = useInboxOptions(message);

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
