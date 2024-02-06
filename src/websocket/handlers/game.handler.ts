const startGame = (socketId: string, code: string) => {
  console.log(`User with id: ${socketId} has started the game with code: ${code}`);
};

export const gameHandler = {
  startGame,
};
