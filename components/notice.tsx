import React from "react";

const Notice = () => {
  return (
    <div className="w-full max-w-5xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-zinc-00 dark:bg-zinc-900 border-l-4 border-yellow-500 dark:border-yellow-400 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-yellow-800 dark:text-yellow-200 mb-3">
          🚧 We&apos;re Just Getting Started!
        </h2>

        <p className="text-gray-800 dark:text-gray-100 mb-4 text-base sm:text-lg">
          Swadeshi Scan is constantly evolving &mdash; we&apos;re planning to
          bring even more helpful features to support Indian-made products,
          enhance sustainability, and empower local businesses. Keep an eye out
          for exciting updates!
        </p>

        <p className="text-gray-800 dark:text-gray-100 mb-4 text-base sm:text-lg">
          🧠 Got ideas or feedback? We&apos;re all ears! Your suggestions could
          shape the next big feature.
        </p>

        <p className="text-gray-800 dark:text-gray-100 mb-4 text-base sm:text-lg">
          🛠️ Interested in contributing? We&apos;re open source and thrilled to
          collaborate with developers, designers, and thinkers like you.
        </p>

        <div className="bg-yellow-200 dark:bg-yellow-800 p-4 rounded-md mt-4 space-y-2">
          <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100">
            🔗 <span className="font-semibold">Connect with the creator:</span>{" "}
            <a
              href="https://www.linkedin.com/in/anikesh-kumar-1b87b42a5/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              LinkedIn - Anikesh Kumar
            </a>
          </p>
          <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100">
            💻 <span className="font-semibold">Contribute on GitHub:</span>{" "}
            <a
              href="https://github.com/uzumaki-ak/Swadeshi-Scan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              GitHub Repository
            </a>
          </p>
        </div>

        <div className="bg-yellow-200 dark:bg-yellow-800 p-4 rounded-md mt-4 space-y-2">
          <p className="text-sm sm:text-base text-gray-900 dark:text-gray-100">
            🏷️ <span className="font-semibold">Upcoming Features:</span>
          </p>
          <ul className="text-sm sm:text-base text-gray-900 dark:text-gray-100 space-y-2">
            <li>
              📊 <strong>Economic Impact QR</strong> &mdash; Scan to see GDP/job
              contribution (🚧 V0)
            </li>
            <li>
              🏅 <strong>Desh Points</strong> &mdash; Earn rewards for buying
              Indian (🚧 V0)
            </li>
            <li>
              📊 <strong>Admin Dashboard</strong> &mdash; Businesses add/update
              product metrics (🚧 V0)
            </li>
            <li>
              🌍 <strong>Carbon Calculator</strong> &mdash; Auto-compute
              footprint via Climatiq.io (🚧 V1)
            </li>
            <li>
              🔐 <strong>Blockchain Verification</strong> &mdash; Tamper-proof
              manufacturing data (⏳ V2)
            </li>
            <li>
              🗣️ <strong>Voice/AR Mode</strong> &mdash; Accessibility for
              non-literate users (⏳ V2)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Notice;
