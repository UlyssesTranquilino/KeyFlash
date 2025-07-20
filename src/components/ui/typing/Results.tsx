import { motion } from "framer-motion";
import { Check, X, Clock, Type, BarChart2, Award } from "lucide-react";
import { useTimer } from "@/app/context/TimerContext";
import { useQuote } from "@/app/context/QuoteContext";

const Results = ({
  wpm,
  accuracy,
  correctChars,
  incorrectChars,
  totalChars,
  quote,
  author,
  mistakes,
  startTime,
  endTime,
  handleRefetch,
  handleRetype,
  sessionType = "multiple",
}: {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  quote: string;
  author: string;
  mistakes: number;
  startTime: number | null;
  endTime: number;
  handleRefetch: () => void;
  handleRetype: (quoteData: any) => void;
  sessionType?: string;
}) => {
  const { time } = useTimer();
  const { setQuote, originalQuote } = useQuote();

  const duration =
    time > 0 ? time : startTime ? ((endTime - startTime) / 1000).toFixed(2) : 0;
  const netWpm = Math.max(0, wpm - mistakes / 5); // Net WPM with error penalty
  const consistency = 85; // This would need to be calculated based on WPM variance

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-6 -mt-18 "
    >
      <div className="text-center mb-4">
        <h2 className="text-3xl  text-white mb-2">Typing Results</h2>
        {time === -1 && (
          <p className="text-gray-400">
            You completed the test in{" "}
            <span className="text-cyan-400">{duration}s</span>
          </p>
        )}
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-4">
        {/* WPM Card */}
        <StatCard
          icon={<Award className="text-amber-400" size={24} />}
          title="Speed"
          value={wpm}
          unit="WPM"
          description={`${netWpm.toFixed(1)} net WPM`}
          colorClass="text-amber-400"
        />

        {/* Accuracy Card */}
        <StatCard
          icon={<Check className="text-emerald-400" size={24} />}
          title="Accuracy"
          value={accuracy.toFixed(1)}
          unit="%"
          description={`${mistakes} mistakes`}
          colorClass="text-emerald-400"
        />

        {/* Consistency Card */}
        <StatCard
          icon={<BarChart2 className="text-blue-400" size={24} />}
          title="Consistency"
          value={consistency}
          unit="%"
          description="Speed variation"
          colorClass="text-blue-400"
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
        {/* Character Breakdown */}
        <div className="p-5 rounded-lg border ">
          <h3 className="flex items-center text-lg  mb-4 text-white w-full text-center ">
            <Type className="mr-2" size={20} /> Character Breakdown
          </h3>
          <div className="space-y-3">
            <StatRow
              label="Correct characters"
              value={correctChars}
              colorClass="text-blue-400"
            />
            <StatRow
              label="Incorrect characters"
              value={incorrectChars}
              colorClass="text-red-400"
            />
            <StatRow
              label="Total characters"
              value={totalChars}
              colorClass="text-white"
            />
            <div className="pt-2">
              <div className="flex  items-center h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-700 to-blue-400"
                  style={{
                    width: `${(correctChars / totalChars) * 100}%`,
                  }}
                />
                <div
                  className="h-full bg-gradient-to-r  from-red-800 to-red-400"
                  style={{
                    width: `${(incorrectChars / totalChars) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Time Metrics */}
        <div className="p-5 rounded-lg border ">
          <h3 className="flex items-center text-lg font-semibold mb-4 text-gray-300">
            <Clock className="mr-2" size={20} /> Time Metrics
          </h3>
          <div className="space-y-3">
            <StatRow
              label="Test duration"
              value={`${duration}s`}
              colorClass="text-gray-100"
            />
            <StatRow
              label="Characters per minute"
              value={Math.round((correctChars / +duration) * 60)}
              colorClass="text-gray-100"
            />
            <StatRow
              label="Average per character"
              value={`${((+duration * 1000) / totalChars).toFixed(2)}ms`}
              colorClass="text-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {sessionType === "multiple" && (
          <button
            onClick={handleRefetch}
            className="px-6 lg:px-10 py-3 border-1 border-blue-900 hover:bg-blue-800/20 rounded-md  transition-colors"
          >
            New {author === "" ? "Texts" : author == "code" ? "Code" : "Quote"}
          </button>
        )}
        <button
          onClick={() => {
            handleRetype(originalQuote ?? quote);
          }}
          className="px-6 lg:px-10 py-3 border-1 border-gray-700 hover:bg-gray-800/40 rounded-md  transition-colors"
        >
          Try Again
        </button>
      </div>
    </motion.div>
  );
};

// Reusable Stat Card Component
const StatCard = ({
  icon,
  title,
  value,
  unit,
  description,
  colorClass,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  unit: string;
  description: string;
  colorClass: string;
}) => (
  <div className="h-35 flex items-center justify-center relative bg-blue-950/30 statCard-bg  p-5 w-full  rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm ">
    <div className="mb-3 scale-130 w-14 ">{icon}</div>
    <div>
      <h3 className="text-lg  mb-1 text-gray-200">{title}</h3>
      <p className={`text-4xl font-bold mb-1 ${colorClass}`}>
        {value}
        <span className="text-xl ml-1">{unit}</span>
      </p>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  </div>
);

// Reusable Stat Row Component
const StatRow = ({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: string | number;
  colorClass: string;
}) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-400">{label}</span>
    <span className={`font-medium ${colorClass}`}>{value}</span>
  </div>
);

export default Results;
