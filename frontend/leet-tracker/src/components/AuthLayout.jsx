import { Link } from 'react-router-dom';

export default function AuthLayout({ children, title, subtitle, link, linkText }) {
  return (
        <div className="rounded-2xl bg-[var(--ctp-mantle)] bg-opacity-80 backdrop-blur-md p-6">
          <h2 className="text-2xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-[var(--ctp-blue)] to-[var(--ctp-mauve)] mb-4 drop-shadow">
            {title}
          </h2>
          <p className="text-xs text-[var(--ctp-subtext0)] mb-4 text-center">
            {subtitle}{' '}
            {link && (
              <Link
                to={link}
                className="text-[var(--ctp-blue)] hover:underline"
              >
                {linkText}
              </Link>
            )}
          </p>
          {children}
        </div>
  );
} 