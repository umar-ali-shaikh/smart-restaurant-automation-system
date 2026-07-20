import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 text-[#e8dcc8]">
      <div className="w-full max-w-md text-center">
        <h1 className="serif text-3xl text-[#d4aa5a]">Cart</h1>
        <p className="mt-3 text-sm text-[#8a7d6a]">
          Your cart is managed from the QR ordering flow.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 rounded-full bg-[#d4aa5a] px-5 py-2 text-sm font-semibold text-black"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
}
