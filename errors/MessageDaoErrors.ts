export enum MessageDaoErrors {
  DB_ERROR_CREATING_MESSAGE = 'Database error creating message.',
  DB_ERROR_RETRIEVING_LAST_CONVERSATION_MESSAGES = 'Database error in retrieving the latest conversation message for user',
  DB_ERROR_CREATING_CONVERSATION = 'Database error creating conversation.',
  DB_ERROR_GETTING_CONVERSATION_MESSAGES = 'Database error in getting all messages for conversation.',
  NO_MATCHING_MESSAGES = 'No messages found for the provided conversation.',
  INVALID_CONVERSATION = 'Invalid conversation. Either conversation id invalid, or sender is not a participant in the conversation.',
  DB_ERROR_DELETING_MESSAGE = 'Database error deleting message.',
  NO_MESSAGE_FOUND = 'No message found.',
  NO_CONVERSATION_FOUND = 'No matching conversation found.',
  DB_ERROR_DELETING_CONVERSATION = 'Database error deleting conversation.',
}
