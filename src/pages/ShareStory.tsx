import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import type { Category } from "../types/story";
import { supabase } from '../supabaseClient';

const categories: Category[] = ["ملهمة", "حزينة", "مضحكة", "أخرى"];

export default function ShareStory() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Inspiring");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !author) {
      alert("Title and story content are required.");
      return;
    }

    const { error: supabaseError } = await supabase
      .from('stories')
      .insert([
        { 
          title: title.trim(),
          category: category === "أخرى" ? customCategory : category,
          content: content.trim(),
          author: author.trim() || "Anonymous",
        }
      ]);

    if (supabaseError) {
      setError("حدث خطأ أثناء النشر: " + supabaseError.message);
    } else {
      setError("");
      navigate("/");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
          شاركنا قصتك
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
         املأ النموذج ادناه لنشر قصتك.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              العنوان
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              placeholder="اختر عنوان جذاب لقصتك"
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-brand transition-shadow"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              التصنيفات
            </label>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                    category === cat
                      ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                      : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {category === "أخرى" && (
  <input
    type="text"
    placeholder="اكتب تصنيفك هنا..."
    value={customCategory}
    onChange={(e) => setCustomCategory(e.target.value)}
    className="w-full p-2 mt-2 border rounded-md text-black focus:border-blue-500 outline-none"
    required
  />
)}
          </div>

          {/* Content */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between mb-1">
  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
    قصتك
  </label>
  <button 
    type="button"
    onClick={() => setShowInstructions(true)}
    className="flex items-center gap-1 text-[10px] bg-amber-50 text-amber-700 px-2 py-1 rounded-full border border-amber-200 hover:bg-amber-100 transition-all shadow-sm"
  >
    <span>🖊️</span> إرشادات الكتابة
  </button>
</div>
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (error) setError("");
              }}
              rows={6}
              placeholder="احكي لينا الحصل شنو..."
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-brand transition-shadow resize-none"
            />
          </div>

          {/* Optional name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              اسمك <span className="text-gray-400 font-normal">(إجباري)</span>
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="اسمك او لقبك..."
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-brand transition-shadow"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 font-medium">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 bg-black text-white hover:bg-brand hover:text-black px-6 py-3 rounded-xl font-semibold transition-colors duration-300"
          >
            <Send size={18} />
            مشاركة القصة
          </button>
        </form>
        {showInstructions && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-900 p-8 rounded-3xl max-w-lg w-full shadow-2xl border dark:border-gray-800 relative"
    >
      <h3 className="text-2xl font-bold mb-4 text-black dark:text-white border-b pb-2">🖊️ إرشادات كتابة قصتك</h3>
      <div className="space-y-4 text-gray-700 dark:text-gray-300 text-base leading-relaxed text-right" dir="rtl">
        <p className="font-bold text-amber-600">نريد قصتك كما هي… صادقة وبسيطة، لكن واضحة ومفيدة.</p>
        <ul className="list-disc list-inside space-y-2 pr-2">
          <li>اكتب بأسلوبك أنت، بدون تعقيد أو تكلف</li>
          <li>ركّز على تجربتك الحقيقية، وليس كلاماً عاماً</li>
          <li>اذكر مواقف أو لحظات أثّرت فيك</li>
          <li>قدّم نصيحة صادقة كنت تتمنى أن تسمعها</li>
          <li>حاول أن يكون المقال منظماً (بداية – تجربة – درس – نصيحة)</li>
        </ul>
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border-r-4 border-amber-400">
          <p className="font-bold">📌 تذكّر:</p>
          <p>ليست أفضل القصص هي الأطول… بل الأصدق والأقرب للواقع.</p>
        </div>
        <p className="text-center font-bold text-amber-500 mt-4 italic">✨ اكتب لتُفيد، لا لتُبهر فقط.</p>
      </div>
      <button 
        type="button"
        onClick={() => setShowInstructions(false)}
        className="w-full mt-8 bg-amber-600 text-white py-4 rounded-2xl font-bold hover:bg-amber-700 transition-colors shadow-lg"
      >
        فهمت، يلا نبدأ!
      </button>
    </motion.div>
  </div>
)}
<button
  type="button"
  onClick={() => setShowWarning(true)}
  className="fixed bottom-10 left-6 z-40 bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600 transition-all animate-bounce hover:animate-none"
  title="تنبيهات المحتوى"
>
  <span className="text-xl">⚠️</span>
</button>
{showWarning && (
  <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] max-w-lg w-full border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] text-right"
      dir="rtl"
    >
      <h3 className="text-2xl font-bold mb-4 text-red-600 flex items-center gap-2">
        ⚠️ تنبيه مهم قبل إرسال قصتك
      </h3>
      
      <p className="text-gray-700 dark:text-gray-200 font-medium mb-4">
        نرحّب بجميع التجارب… لكن في إطار الاحترام والمسؤولية.
      </p>

      <ul className="space-y-3 text-gray-600 dark:text-gray-400 text-sm">
        <li className="flex gap-2"><span>•</span> يُمنع استخدام الألفاظ النابية أو غير اللائقة.</li>
        <li className="flex gap-2"><span>•</span> يُمنع الإساءة لأي شخص أو جهة (أساتذة، طلاب، مؤسسات…).</li>
        <li className="flex gap-2"><span>•</span> تجنّب السخرية الجارحة أو التعميمات المسيئة.</li>
        <li className="flex gap-2"><span>•</span> احرص أن يكون طرحك ناقداً باحترام، لا هجوماً.</li>
      </ul>

      <div className="mt-6 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl text-red-700 dark:text-red-400 text-sm border-r-4 border-red-500">
        <strong>📌 تذكّر:</strong> أي محتوى يتضمن إساءة أو ألفاظ غير مناسبة 
        <span className="font-bold underline text-red-800 dark:text-red-300"> لن يتم قبوله أو نشره.</span>
      </div>

      <p className="text-center font-bold text-gray-500 mt-6 text-xs">
        نهدف إلى بيئة راقية تعكس وعي طلاب الهندسة… فكن جزءاً منها.
      </p>

      <button 
        onClick={() => setShowWarning(false)}
        className="w-full mt-6 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-all"
      >
        فهمت وأتعهد بذلك
      </button>
    </motion.div>
  </div>
)}
      </motion.div>
    </div>
  );
}
