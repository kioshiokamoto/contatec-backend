const socket = io('http://localhost:3001');

const message = document.getElementById('message');
const message2 = document.getElementById('message2');
const messages = document.getElementById('messages');
const handleSubmitNewMessage = () => {
  console.log(socket.id);
  socket.emit('messageDefault', { from: message.value, data: message2.value });
};
socket.on('connect', () => {
  socket.emit('identity', 55);
});
socket.on('messageDefault', ({ data }) => {
  handleNewMessage(data);
});

const handleNewMessage = (message) => {
  messages.appendChild(buildNewMessage(message));
};

const buildNewMessage = (message) => {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(message));
  return li;
};
