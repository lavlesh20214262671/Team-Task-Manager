import { ReactNode, ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
  children: ReactNode;
};

const Button = ({ variant = 'primary', size, children, className = '', ...props }: ButtonProps) => (
  <button className={`btn btn-${variant}${size === 'sm' ? ' btn-sm' : ''} ${className}`} {...props}>
    {children}
  </button>
);

export default Button;
