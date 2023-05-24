import SpinnerSmall from "../spinner/spinnerSmall";

export default function LoadingPage() {
  return (
    <div className="fixed w-full h-screen flex items-center justify-center">
      <SpinnerSmall />
    </div>
  );
}
