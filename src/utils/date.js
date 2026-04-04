import dayjs from 'dayjs';
import 'dayjs/locale/uz';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatDate = (date) => dayjs(date).format('DD.MM.YYYY');
export const formatTime = (date) => dayjs(date).format('HH:mm');
export const formatDateTime = (date) => dayjs(date).format('DD.MM.YYYY HH:mm');
export const formatRelative = (date) => dayjs(date).fromNow();
