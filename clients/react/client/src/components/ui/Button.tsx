import Spinner from "./Spinner";

export default function Button({
  text,
  onClick,
  isLoading = false,
  disabled = false,
}: {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="w-full flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-base font-bold text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-primary disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
    >
      {isLoading ? <Spinner /> : <>{text}</>}
    </button>
  );
}
