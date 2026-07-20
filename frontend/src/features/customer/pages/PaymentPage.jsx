import { useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 text-[#e8dcc8]">
      <div className="w-full max-w-md text-center">
        <h1 className="serif text-3xl text-[#d4aa5a]">Payment</h1>
        <p className="mt-3 text-sm text-[#8a7d6a]">
          Payment checkout will attach to the billing service here.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 rounded-full border border-[#d4aa5a]/40 px-5 py-2 text-sm font-semibold text-[#d4aa5a]"
        >
          Continue Ordering
        </button>
      </div>
    </div>
  );
}
