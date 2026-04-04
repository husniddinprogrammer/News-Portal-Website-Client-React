import { Link } from 'react-router-dom';

export const Badge = ({ children, to, className = '' }) => {
  const base =
    'inline-block text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-600 text-white tracking-wide shadow-sm shadow-red-200 transition-all duration-200 hover:bg-red-700 hover:shadow-red-300 ' + className;
  if (to) return <Link to={to} className={base}>{children}</Link>;
  return <span className={base}>{children}</span>;
};
