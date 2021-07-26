const socket = io('http://localhost:3001');

const message = document.getElementById('message');
const message2 = document.getElementById('message2');
const messages = document.getElementById('messages');
const handleSubmitNewMessage = () => {
  console.log(socket.id);
  socket.emit('messageDefault', {
    to: message.value,
    data: message2.value,
    from: 1,
    post: 42,
  });
};
socket.on('connect', () => {
  //Id de usuario
  socket.emit('identity', 1);
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
