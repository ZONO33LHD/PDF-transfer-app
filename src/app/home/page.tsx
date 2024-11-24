"use client";

import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

// PDFワーカーの設定を修正
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '../../../pdfjs/pdf.worker.min.mjs';
}

export default function Home() {
  const [isConverting, setIsConverting] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsConverting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument(arrayBuffer);
      const pdf = await loadingTask.promise;
      const fileName = file.name.replace(".pdf", "");

      // 全ページを処理
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.0 });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        if (context) {
          await page.render({
            canvasContext: context,
            viewport: viewport,
          }).promise;

          // 画像としてダウンロード
          const image = canvas.toDataURL("image/png", 1.0);
          const link = document.createElement("a");
          link.href = image;
          link.download = `${fileName}_page${i.toString().padStart(3, "0")}.png`;
          link.click();
          link.remove();
        }
      }
    } catch (error) {
      console.error("変換エラー:", error);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">PDFビュワー</h1>

      <label className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
        PDFをアップロード
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
          disabled={isConverting}
        />
      </label>

      {isConverting && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-700">変換中...</p>
          </div>
        </div>
      )}
    </main>
  );
}
