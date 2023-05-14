export default function LoadingOverlay() {
  return (
    <div className="fixed w-full h-screen z-1 opacity-75 flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-400 border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
    </div>
  );
}
