import { useState } from "react";
import { motion } from "framer-motion";
import { ImageIcon, UploadCloud, Loader2 } from "lucide-react";

export default function ImageDetector({ onResult }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (file) => {
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", image);

      const response = await fetch("http://127.0.0.1:8000/predict-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setLoading(false);

      onResult({
        type: "image",
        verdict: data.prediction.verdict.toLowerCase(), // ✅ FIXED
        confidence: data.prediction.confidence, // ✅ NEW
        heatmap: data.explanation, // ✅ GradCAM
      });
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-2xl bg-indigo-100 text-indigo-600">
          <ImageIcon size={22} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Image News Analysis</h2>
      </div>

      {/* Upload Area */}
      <label className="group cursor-pointer">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleImageChange(e.target.files[0])}
        />

        <div className="border-2 border-dashed border-gray-300 rounded-3xl p-10 flex flex-col items-center justify-center text-center transition group-hover:border-indigo-400 group-hover:bg-indigo-50">
          {!preview ? (
            <>
              <UploadCloud size={36} className="text-gray-400 mb-4" />
              <p className="text-gray-600 font-medium">
                Upload or drag & drop an image
              </p>
              <p className="text-sm text-gray-400 mt-1">
                PNG, JPG, JPEG supported
              </p>
            </>
          ) : (
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 rounded-2xl object-contain"
            />
          )}
        </div>
      </label>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={loading || !image}
        className={`w-full sm:w-auto px-10 py-3 my-5 cursor-pointer rounded-2xl font-semibold flex items-center justify-center gap-2 transition shadow 
          ${
            loading || !image
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Analyzing...
          </>
        ) : (
          "Analyze Image"
        )}
      </button>

      {/* UX Hint */}
      <p className="text-sm text-gray-500">
        Tip: Clear, un-cropped images improve detection accuracy and
        explainability.
      </p>
    </motion.div>
  );
}
