import nodeNotifier from 'node-notifier';

const notify = ({ message, subtitle }) => {
  return nodeNotifier.notify({
    title: 'Superfast',
    message,
    subtitle,
  });
};

export default notify;
