import { Spinner } from "./ui";

export default function LoadingOverlay() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center">
        <Spinner />
        <p className="mt-4 text-lg font-semibold text-text-color">Loading...</p>
      </div>
    </div>
  );
}
