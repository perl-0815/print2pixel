"use client";

import { useMemo, useState } from "react";

type PaperSize = {
  id: string;
  label: string;
  widthMm: number;
  heightMm: number;
};

const paperSizes: PaperSize[] = [
  { id: "A0", label: "A0", widthMm: 841, heightMm: 1189 },
  { id: "A1", label: "A1", widthMm: 594, heightMm: 841 },
  { id: "A2", label: "A2", widthMm: 420, heightMm: 594 },
  { id: "A3", label: "A3", widthMm: 297, heightMm: 420 },
  { id: "A4", label: "A4", widthMm: 210, heightMm: 297 },
  { id: "A5", label: "A5", widthMm: 148, heightMm: 210 },
  { id: "A6", label: "A6", widthMm: 105, heightMm: 148 },
  { id: "A7", label: "A7", widthMm: 74, heightMm: 105 },
  { id: "A8", label: "A8", widthMm: 52, heightMm: 74 },
  { id: "A9", label: "A9", widthMm: 37, heightMm: 52 },
  { id: "A10", label: "A10", widthMm: 26, heightMm: 37 },
  { id: "B0", label: "B0", widthMm: 1000, heightMm: 1414 },
  { id: "B1", label: "B1", widthMm: 707, heightMm: 1000 },
  { id: "B2", label: "B2", widthMm: 500, heightMm: 707 },
  { id: "B3", label: "B3", widthMm: 353, heightMm: 500 },
  { id: "B4", label: "B4", widthMm: 250, heightMm: 353 },
  { id: "B5", label: "B5", widthMm: 176, heightMm: 250 },
  { id: "B6", label: "B6", widthMm: 125, heightMm: 176 },
];

const formatNumber = (value: number) =>
  value.toLocaleString("ja-JP", { maximumFractionDigits: 0 });

export default function Home() {
  const [activeId, setActiveId] = useState("A4");
  const [widthMm, setWidthMm] = useState(210);
  const [heightMm, setHeightMm] = useState(297);
  const [dpi, setDpi] = useState(300);
  const [multiplier, setMultiplier] = useState(2);
  const [series, setSeries] = useState<"A" | "B">("A");
  const selected = useMemo(
    () => paperSizes.find((paper) => paper.id === activeId),
    [activeId]
  );

  const filteredSizes = useMemo(
    () => paperSizes.filter((paper) => paper.id.startsWith(series)),
    [series]
  );

  const updateFromPreset = (paper: PaperSize) => {
    setActiveId(paper.id);
    setWidthMm(paper.widthMm);
    setHeightMm(paper.heightMm);
    setSeries(paper.id.startsWith("B") ? "B" : "A");
  };

  const handleSeriesChange = (nextSeries: "A" | "B") => {
    setSeries(nextSeries);
    if (!activeId.startsWith(nextSeries)) {
      const nextPaper = paperSizes.find((paper) =>
        paper.id.startsWith(nextSeries)
      );
      if (nextPaper) {
        setActiveId(nextPaper.id);
        setWidthMm(nextPaper.widthMm);
        setHeightMm(nextPaper.heightMm);
      }
    }
  };

  const updateManual = (nextWidth: number, nextHeight: number) => {
    setWidthMm(nextWidth);
    setHeightMm(nextHeight);
  };

  const swapOrientation = () => {
    setWidthMm(heightMm);
    setHeightMm(widthMm);
  };

  const dpiValue = Number.isFinite(dpi) && dpi > 0 ? dpi : 300;
  const widthInch = widthMm / 25.4;
  const heightInch = heightMm / 25.4;
  const widthPx = Math.round(widthInch * dpiValue);
  const heightPx = Math.round(heightInch * dpiValue);

  const previewRatio = widthMm / heightMm;
  const previewWidth = previewRatio >= 1 ? 240 : 180 * previewRatio;
  const previewHeight = previewRatio >= 1 ? 240 / previewRatio : 180;

  return (
    <div className="app-shell min-h-screen px-6 py-12 text-[#2b2017]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="floaty absolute -top-10 left-10 h-40 w-40 rounded-[48px] bg-[rgba(255,255,255,0.55)] blur-2xl" />
        <div className="floaty absolute right-16 top-24 h-56 w-56 rounded-full bg-[rgba(255,245,240,0.8)] blur-2xl" />
      </div>
      <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="reveal flex flex-col gap-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#2c1e14] soft-ring">
            print2pixel
            <span className="h-2 w-2 rounded-full bg-[#f3a395]" />
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-semibold leading-tight text-[#2a1d14] md:text-5xl">
              印刷サイズからピクセル数を算出
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[#4a3c32] md:text-lg">
              Figmaや画像制作のために、mmとDPIからピクセル数を自動計算。
            </p>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="clay-card reveal flex flex-col gap-8 p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">サイズを選ぶ</h2>
              <div className="flex items-center gap-2 rounded-full bg-white/70 p-1 text-sm font-semibold text-[#2a1d14]">
                <button
                  onClick={() => handleSeriesChange("A")}
                  className={`rounded-full px-4 py-2 transition ${
                    series === "A"
                      ? "bg-[#2a1d14] text-white"
                      : "text-[#4a3c32]"
                  }`}
                >
                  Aシリーズ
                </button>
                <button
                  onClick={() => handleSeriesChange("B")}
                  className={`rounded-full px-4 py-2 transition ${
                    series === "B"
                      ? "bg-[#2a1d14] text-white"
                      : "text-[#4a3c32]"
                  }`}
                >
                  Bシリーズ
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid grid-cols-4 gap-3 md:grid-cols-6">
                {filteredSizes.map((paper) => {
                  const isActive = paper.id === activeId;
                  return (
                    <button
                      key={paper.id}
                      onClick={() => updateFromPreset(paper)}
                      className={`rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                        isActive
                          ? "bg-white/90 text-[#2a1d14] soft-ring"
                          : "clay-inset text-[#4a3c32]"
                      }`}
                    >
                      {paper.label}
                    </button>
                  );
                })}
              </div>
              <div className="clay-inset flex flex-col gap-4 rounded-3xl p-5">
                <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-[#3b2f27]">
                  <span className="rounded-full bg-white/70 px-3 py-1">
                    {selected?.label ?? "Custom"}
                  </span>
                  <span className="text-[#5b4b40]">
                    {formatNumber(widthMm)}mm × {formatNumber(heightMm)}mm
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm font-semibold text-[#3b2f27]">
                    幅 (mm)
                    <input
                      type="number"
                      min={1}
                      value={widthMm}
                      onChange={(event) =>
                        updateManual(
                          Number(event.target.value),
                          Number(heightMm)
                        )
                      }
                      className="rounded-2xl border border-transparent bg-white/80 px-4 py-3 text-lg font-semibold text-[#2a1d14] outline-none focus:border-[#f3a395]"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-semibold text-[#3b2f27]">
                    高さ (mm)
                    <input
                      type="number"
                      min={1}
                      value={heightMm}
                      onChange={(event) =>
                        updateManual(
                          Number(widthMm),
                          Number(event.target.value)
                        )
                      }
                      className="rounded-2xl border border-transparent bg-white/80 px-4 py-3 text-lg font-semibold text-[#2a1d14] outline-none focus:border-[#f3a395]"
                    />
                  </label>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={swapOrientation}
                    className="rounded-full bg-[#2a1d14] px-4 py-2 text-sm font-semibold text-white"
                  >
                    縦横を入れ替え
                  </button>
                  <span className="text-xs text-[#6c5b4e]">
                    {widthMm}mm = {widthInch.toFixed(2)}inch
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">DPIを設定</h3>
                  <p className="text-sm text-[#6c5b4e]">
                    印刷の標準は300DPI。用途に合わせて変更できます。
                  </p>
                </div>
              </div>
              <div className="clay-inset flex flex-col gap-4 rounded-3xl p-5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-[#3b2f27]">
                    DPI
                  </label>
                  <input
                    type="number"
                    min={30}
                    max={1200}
                    value={dpi}
                    onChange={(event) => setDpi(Number(event.target.value))}
                    className="w-24 rounded-xl border border-transparent bg-white/80 px-3 py-2 text-right text-base font-semibold text-[#2a1d14] outline-none focus:border-[#8bd3c7]"
                  />
                </div>
                <div className="grid gap-3 text-sm text-[#5b4b40]">
                  <button
                    onClick={() => setDpi(72)}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 font-semibold transition ${
                      dpiValue === 72
                        ? "bg-white/90 text-[#2a1d14] soft-ring"
                        : "bg-white/70 text-[#3b2f27]"
                    }`}
                  >
                    <span>72 DPI</span>
                    <span className="text-xs font-medium">
                      画面表示 / 低解像度プレビュー
                    </span>
                  </button>
                  <button
                    onClick={() => setDpi(150)}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 font-semibold transition ${
                      dpiValue === 150
                        ? "bg-white/90 text-[#2a1d14] soft-ring"
                        : "bg-white/70 text-[#3b2f27]"
                    }`}
                  >
                    <span>150 DPI</span>
                    <span className="text-xs font-medium">
                      校正 / ラフ印刷
                    </span>
                  </button>
                  <button
                    onClick={() => setDpi(300)}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 font-semibold transition ${
                      dpiValue === 300
                        ? "bg-white/90 text-[#2a1d14] soft-ring"
                        : "bg-white/70 text-[#3b2f27]"
                    }`}
                  >
                    <span>300 DPI</span>
                    <span className="text-xs font-medium">
                      本番印刷 / 高品質
                    </span>
                  </button>
                  <button
                    onClick={() => setDpi(350)}
                    className={`flex items-center justify-between rounded-2xl px-4 py-3 font-semibold transition ${
                      dpiValue === 350
                        ? "bg-white/90 text-[#2a1d14] soft-ring"
                        : "bg-white/70 text-[#3b2f27]"
                    }`}
                  >
                    <span>350 DPI</span>
                    <span className="text-xs font-medium">
                      美術印刷 / 超高精細
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="clay-card reveal flex flex-col justify-between gap-8 p-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold">ピクセル結果</h2>
              <div className="grid gap-4">
                <div className="clay-inset rounded-3xl p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6c5b4e]">
                    1x (Figma/画像)
                  </p>
                  <div className="mt-3 text-3xl font-semibold text-[#2a1d14]">
                    {formatNumber(widthPx)} × {formatNumber(heightPx)} px
                  </div>
                  <p className="mt-2 text-sm text-[#6c5b4e]">
                    {widthMm}mm × {heightMm}mm / {dpiValue} DPI
                  </p>
                </div>
                <div className="rounded-3xl bg-white/70 p-5 soft-ring">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-[#3b2f27]">
                    <label className="flex items-center gap-2">
                      <span>x</span>
                      <input
                        type="number"
                        min={0.1}
                        step={0.1}
                        value={multiplier}
                        onChange={(event) =>
                          setMultiplier(Number(event.target.value))
                        }
                        className="w-20 rounded-xl border border-transparent bg-white/80 px-2 py-1 text-right text-sm font-semibold text-[#2a1d14] outline-none focus:border-[#f3a395]"
                      />
                      <span className="text-xs text-[#6c5b4e]">
                        書き出し倍率
                      </span>
                    </label>
                    <span>
                      {formatNumber(widthPx * multiplier)} ×{" "}
                      {formatNumber(heightPx * multiplier)} px
                    </span>
                  </div>
                </div>
                <div className="rounded-3xl bg-white/70 p-5 soft-ring">
                  <div className="flex items-center justify-between text-sm font-semibold text-[#3b2f27]">
                    <span>インチ換算</span>
                    <span>
                      {widthInch.toFixed(2)} × {heightInch.toFixed(2)} inch
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">プレビュー比率</h3>
                <span className="text-sm text-[#6c5b4e]">
                  {widthMm}:{heightMm}
                </span>
              </div>
              <div className="flex items-center justify-center rounded-[32px] bg-white/70 p-6 soft-ring">
                <div
                  className="relative border-2 border-black bg-white"
                  style={{
                    width: `${previewWidth}px`,
                    height: `${previewHeight}px`,
                  }}
                >
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white px-2 text-xs font-semibold text-black">
                    {formatNumber(widthPx)} px
                  </span>
                  <span className="absolute -right-10 top-1/2 -translate-y-1/2 bg-white px-2 text-xs font-semibold text-black">
                    {formatNumber(heightPx)} px
                  </span>
                </div>
              </div>
              <div className="text-sm text-[#6c5b4e]">
                余白を含めた印刷の完成サイズを想定して計算しています。
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
