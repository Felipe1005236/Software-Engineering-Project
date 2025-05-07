import { Link } from 'react-router-dom';

export default function LearnMore() {
  const features = [
    {
      title: "📊 Dashboard Overview",
      desc: "Stay informed at a glance with our intelligent dashboard. Visualize team progress, task completion, deadlines, and engagement — all in real time.",
      image: "/dashboard-screenshot.png",
      reversed: false,
    },
    {
      title: "📁 Projects Workspace",
      desc: "Organize your work with smart boards, drag-and-drop tasks, and progress tracking across all teams. Built for clarity and collaboration.",
      image: "/projects-screenshot.png",
      reversed: true,
    },
    {
      title: "📅 Calendar View",
      desc: "Plan your week with a drag-and-drop calendar synced to your tasks. Stay on top of your schedule, spot deadlines, and never miss a beat.",
      image: "/calendar-screenshot.png",
      reversed: false,
    },
  ];

  return (
    <div className="bg-black text-white px-6 py-16 font-sans overflow-x-hidden">

      {/* Header */}
      <div className="text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Explore PLUMP
        </h1>
        <div className="mx-auto w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
        <p className="text-gray-400 text-sm mt-4 max-w-xl mx-auto">
          Discover the tools that help you stay productive, focused, and ahead of the curve.
        </p>
      </div>

      {/* Features */}
      <div className="space-y-40">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row items-start justify-between max-w-7xl mx-auto gap-16 ${
              feature.reversed ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Bubble */}
            <div className="bg-[#1e1e1e] rounded-3xl p-10 shadow-2xl max-w-2xl w-full md:w-1/2 mt-8 md:mt-20 z-10">
              <h2 className="text-3xl font-semibold mb-4">{feature.title}</h2>
              <p className="text-gray-400 text-base leading-relaxed">{feature.desc}</p>
            </div>

            {/* Screenshot */}
            <div
              className={`relative w-[700px] md:w-[850px] h-auto ${
                feature.reversed ? "-ml-64 md:-ml-80" : "-mr-64 md:-mr-80"
              } z-0`}
            >
              <div className={`rounded-xl overflow-hidden border border-white/10 shadow-xl ${
                feature.reversed ? 'mask-gradient-left' : 'mask-gradient-right'
              }`}>
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-auto object-cover rounded-xl transition-transform duration-300 hover:scale-105"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="mt-40 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to organize your time with PLUMP?
        </h2>
        <p className="text-gray-400 text-md mb-10">
          Join the teams who already improved their productivity and focus. 
          Your streamlined workspace is waiting.
        </p>

        {/* CTA Buttons using Link */}
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link to="/login">
            <button className="bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-200 transition text-sm">
              Log In
            </button>
          </Link>
          <Link to="/signup">
            <button className="border border-white px-8 py-4 rounded-full font-medium hover:bg-white hover:text-black transition text-sm">
              Sign Up
            </button>
          </Link>
        </div>
      </div>

      {/* Single Back Button */}
      <div className="mt-20 text-center">
        <Link
          to="/"
          className="text-sm underline text-gray-500 hover:text-white transition"
        >
          ← Back to Home
        </Link>
      </div>

    </div>
  );
}