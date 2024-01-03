/**
 * @readonly
 * @enum {string}
 * Error messages for the message DAO used when throwing exceptions.
 */
export enum MessageDaoErrors {
  DB_ERROR_CREATING_MESSAGE = 'Database error creating message.',
  DB_ERROR_RETRIEVING_LAST_CHAT_MESSAGES = 'Database error in retrieving the latest chat message for user',
  DB_ERROR_CREATING_CHAT = 'Database error creating chat.',
  DB_ERROR_GETTING_CHAT_MESSAGES = 'Database error in getting all messages for chat.',
  DB_ERROR_ALL_MESSAGES_SENT_BY_USER = 'Database error in getting all messages sent by user.',
  NO_MATCHING_MESSAGES = 'No messages found for the provided chat.',
  INVALID_CHAT = 'Invalid chat. Either chat id invalid, or sender is not a participant in the chat.',
  DB_ERROR_DELETING_MESSAGE = 'Database error deleting message.',
  NO_MESSAGE_FOUND = 'No message found.',
  NO_CHAT_FOUND = 'No matching chat found.',
  DB_ERROR_DELETING_CHAT = 'Database error deleting chat.',
  DB_ERROR_FINDING_CHAT = 'Database error finding chat',
}
