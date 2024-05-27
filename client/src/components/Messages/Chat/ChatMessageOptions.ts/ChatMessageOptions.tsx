import { memo } from 'react';
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

/**
 * `MessageOptions` is a component that displays a menu of options for a chat message.
 * It uses the `useChatMessageOptions` custom hook to handle option selection.
 *
 * @param {MessageOptionsProps} message -  The message for which to display options.
 *
 * @returns {JSX.Element} The `MessageOptions` component, which includes an `OptionMenu` with a 'Delete' option.
 * Selecting the 'Delete' option calls the `handleDelete` function from the `useChatMessageOptions` hook.
 *
 * @example
 * <MessageOptions message={message} />
 *
 * @see {@link useChatMessageOptions} for the hook that provides the option handlers.
 * @see {@link OptionMenu} for the component that displays the options menu.
 */
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
