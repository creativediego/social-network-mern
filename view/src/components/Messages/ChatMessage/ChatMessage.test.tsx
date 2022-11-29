import React from 'react';
import ChatMessage from './ChatMessage';
import { render, screen } from '@testing-library/react';
import { IMessage } from '../../../interfaces/IMessage';
import { useChatMessage } from './useChatMessage';
test('Chat message is blue for logged in user', () => {});

jest.mock('./useChatMessage');

const mockMessage: IMessage = {
  id: '1',
  recipients: [],
  message: 'hello world',
  conversationId: '1001',
  createdAt: '',
};

test('new chat button displays select users modal', () => {
  render(<ChatMessage message={mockMessage} />);
  // const chatMess age = screen.getByAltText('chat message');
  // expect(chatMessage).toBeInTheDocument();
});
