import { useState } from "react";
import InputBox from "./components/InputBox";
import useCurrencyInfo from "./hooks/useCurrencyInfo";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const queryParams = new URLSearchParams(window.location.search);
  const initialFrom = queryParams.get("from") || "usd";
  const initialTo = queryParams.get("to") || "inr";
  const initialAmount = Number(queryParams.get("amount")) || 0;
  const initialConvertedAmount =
    Number(queryParams.get("convertedAmount")) || 0;

  const [amount, setAmount] = useState(initialAmount);
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initialTo);
  const [convertedAmount, setConvertedAmount] = useState(
    initialConvertedAmount
  );

  const currencyInfo = useCurrencyInfo(from);

  const options = Object.keys(currencyInfo);

  const swap = () => {
    setFrom(to);
    setTo(from);
    setConvertedAmount(amount);
    setAmount(convertedAmount);
  };

  const convert = () => {
    setConvertedAmount(amount * currencyInfo[to]);
    if (amount === 0) {
      toast.error('Please enter the amount!')
      return;
    }
    toast.success('Successfully converted!')
  };

  const copyLink = () => {
    const url = new URL(window.location);
    url.searchParams.set("from", from);
    url.searchParams.set("to", to);
    url.searchParams.set("amount", amount);
    url.searchParams.set("convertedAmount", convertedAmount);
    navigator.clipboard.writeText(url.toString());
    toast.success('Link copied to clipboard!')
  }

  const BackgroundImage =
    "https://images.pexels.com/photos/259249/pexels-photo-259249.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";

  return (
    <div
      className="w-full h-screen flex flex-wrap justify-center items-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url('${BackgroundImage}')`,
      }}
    >
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full">
        <div className="w-full max-w-md mx-auto border border-gray-60 rounded-lg p-5 backdrop-blur-sm bg-white/30">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              convert();
            }}
          >
            <div className="w-full mb-1">
              <InputBox
                label="From"
                amount={amount}
                currencyOptions={options}
                onCurrencyChange={(currency) => setFrom(currency)}
                selectCurrency={from}
                onAmountChange={(amount) => setAmount(amount)}
                // amountDisable
              />
            </div>
            <div className="relative w-full h-0.5">
              <button
                type="button"
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-md bg-blue-600 text-white px-2 py-0.5"
                onClick={swap}
              >
                swap
              </button>
            </div>
            <div className="w-full mt-1 mb-4">
              <InputBox
                label="To"
                amount={convertedAmount}
                currencyOptions={options}
                onCurrencyChange={(currency) => setTo(currency)}
                selectCurrency={to}
                // amountDisable
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg"
            >
              Convert {from} → {to}
            </button>
            {amount !==0 && <div className="flex justify-end my-3 mb-0 cursor-pointer" onClick={copyLink}>
              <span className="text-sm font-medium me-2 px-2.5 py-0.5 rounded ">
                <svg
                  className="h-5 w-5 text-blue-600"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {" "}
                  <path stroke="none" d="M0 0h24v24H0z" />{" "}
                  <rect x="8" y="8" width="12" height="12" rx="2" />{" "}
                  <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
                </svg>
              </span>
            </div>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
