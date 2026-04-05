import { Link } from 'react-router-dom';

/**
 * variant:
 *   'default' — solid red (default, light backgrounds)
 *   'glass'   — frosted glass (on top of images)
 *   'outline' — red border, transparent bg
 */
export const Badge = ({ children, to, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-red-600 text-white hover:bg-red-700',
    glass:   'bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30',
    outline: 'border border-red-300 text-red-600 hover:bg-red-50',
  };

  const base = `inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full tracking-wide transition-all duration-150 ${variants[variant]} ${className}`;

  if (to) return <Link to={to} className={base}>{children}</Link>;
  return <span className={base}>{children}</span>;
};
