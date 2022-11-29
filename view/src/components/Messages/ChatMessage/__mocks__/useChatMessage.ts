// export const useChatMessage = jest.fn(() => {
//   return {
//     isLoggedInUser: true,
//     showOptions: true,
//     setShowOptions: () => {},
//     deleteMessage: () => {},
//   };
// });

const useChatMessage = jest.createMockFromModule('./useChatMessage');
