import { motion } from "framer-motion";
import { CheckCircle, XCircle, Info, ImageIcon } from "lucide-react";

export default function ResultCard({ result, originalText }) {
  if (!result) return null;

  const isReal = result.verdict === "real";

  // Highlight words inside paragraph
  const highlightText = (text) => {
    if (!result.explanation || !text) return text;

    let highlighted = text;

    result.explanation.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");

      highlighted = highlighted.replace(
        regex,
        `<span style="
          background:${isReal ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"};
          padding:2px 4px;
          border-radius:6px;
        ">${word}</span>`,
      );
    });

    return highlighted;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="mt-10 rounded-3xl shadow-xl border border-gray-200 overflow-hidden"
    >
      {/* Header */}
      <div
        className={`p-6 flex items-center gap-4 ${
          isReal ? "bg-green-50" : "bg-red-50"
        }`}
      >
        <div
          className={`p-3 rounded-2xl ${
            isReal ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}
        >
          {isReal ? <CheckCircle size={28} /> : <XCircle size={28} />}
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-800">
            {isReal ? "Real News" : "Fake News"}
          </h3>
          <p className="text-sm text-gray-600">
            Confidence: {Number(result.confidence).toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6 bg-white">
        {/* Highlighted Text */}
        {originalText && (
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">
              Highlighted Analysis
            </h4>
            <p
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: highlightText(originalText),
              }}
            />
          </div>
        )}

        {/* Explanation Badges */}
        {result.explanation && result.explanation.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3 font-semibold text-gray-800">
              <Info size={18} /> Key Influential Words
            </div>

            <div className="flex flex-wrap gap-2">
              {result.explanation.map((word, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm ${
                    isReal
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* IMAGE EXPLANATION (PRO VERSION) */}
        {result.type === "image" && result.heatmap && (
          <div>
            <div className="flex items-center gap-2 mb-3 font-semibold text-gray-800">
              <ImageIcon size={18} /> Visual Explanation (AI Focus Areas)
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-lg max-h-96">
              {/* Blurred Background */}
              <img
                src={result.heatmap}
                alt="Blur Background"
                className="w-full h-full object-contain blur-md scale-105 opacity-70"
              />

              {/* Clear Focus Layer */}
              <img
                src={result.heatmap}
                alt="GradCAM Focus"
                className="absolute inset-0 w-full h-full object-contain"
              />

              {/* Center Highlight Circle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-40 h-40 border-4 border-white rounded-full shadow-2xl animate-pulse"></div>
              </div>

              {/* Overlay Label */}
              <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                AI Focus Regions
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              The highlighted region shows where the AI focused most while
              detecting whether the image is fake or real.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
