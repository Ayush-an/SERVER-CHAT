import Answer from '../models/Answer.js';
import User from '../models/User.js'; // If needed
import Question from '../models/Question.js'; // If needed

export const setupWebSocket = async (server) => {
  const { Server } = await import('socket.io');
  const io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on('connection', (socket) => {
    console.log('New socket connected', socket.id);

    socket.on('submitAnswer', async (data) => {
      io.emit('updateWordCloud', data);

      try {
        await Answer.create(data); // Assuming data has user, question, text
      } catch (err) {
        console.error('Error saving answer:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected', socket.id);
    });
  });
};
