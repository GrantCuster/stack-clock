export function Select({
  children,
  onChange,
  value,
}: {
  children?: React.ReactNode;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
}) {
  return (
    <label
      className={`p-0 bg-neutral-700 flex gap-2 items-center px-4 py-2 rounded-full relative text-white`}
    >
      <select
        className="appearance-none opacity-0 w-full h-full absolute left-0 top-0"
        value={value}
        onChange={onChange}
      >
        {children}
      </select>
    </label>
  );
}
