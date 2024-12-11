import { NavLink } from "react-router";

export function Button({
  children,
  active = false,
  onClick = () => {},
}: {
  children?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className={`${
        active ? "bg-blue-500 text-white" : "bg-neutral-700"
      } flex gap-2 items-center hover:bg-neutral-600 rounded-full px-4 py-2`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  to,
}: {
  to: string;

  children?: React.ReactNode;
}) {
  return (
    <NavLink
      className={() => {
        return `bg-neutral-700 flex gap-2 items-center hover:bg-neutral-600 rounded-full px-4 py-2`;
      }}
      to={to}
    >
      {children}
    </NavLink>
  );
}
