export default function Pricing() {
    return (
      <div className="min-h-screen bg-black text-white px-6 py-20 font-sans flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
          Choose Your Plan
        </h1>
        <p className="text-gray-400 mb-12 text-center max-w-xl">
          Start for free, and upgrade to unlock the full power of PLUMP whenever you're ready.
        </p>
  
        {/* Pricing Cards */}
        <div className="flex flex-col md:flex-row gap-10">
  
          {/* Free Plan */}
          <div className="bg-[#1e1e1e] rounded-3xl p-8 shadow-2xl w-full md:w-[300px] text-center">
            <h2 className="text-2xl font-semibold mb-4">🆓 Free Plan</h2>
            <p className="text-gray-400 text-sm mb-6">
              - Basic Dashboard <br />
              - Limited Projects (3 max) <br />
              - Calendar View Access <br />
              - Community Support
            </p>
            <div className="text-3xl font-bold mb-6">0€</div>
            <button className="border border-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-black transition">
              Get Free
            </button>
          </div>
  
          {/* Premium Plan */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 shadow-2xl w-full md:w-[300px] text-center">
            <h2 className="text-2xl font-semibold mb-4">💎 Premium</h2>
            <p className="text-white text-sm mb-6">
              - Unlimited Projects <br />
              - Advanced Analytics <br />
              - Team Management Tools <br />
              - Priority Support
            </p>
            <div className="text-3xl font-bold mb-6">5€ / month</div>
            <button className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition">
              Upgrade
            </button>
          </div>
  
        </div>
  
        {/* Back Button */}
        <div className="mt-20 text-center">
          <a
            href="/"
            className="text-sm underline text-gray-500 hover:text-white transition"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    );
  }