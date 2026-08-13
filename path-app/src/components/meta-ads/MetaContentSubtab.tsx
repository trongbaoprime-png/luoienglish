"use client";

import { useState } from "react";
import { Eye, ExternalLink, Sparkles, X, Play, Video, FileText, CheckCircle } from "lucide-react";
import { MetaContentRow } from "@/app/admin/meta-ads/page";

interface MetaContentSubtabProps {
  contentAds: MetaContentRow[];
}

export default function MetaContentSubtab({ contentAds }: MetaContentSubtabProps) {
  const [selectedContent, setSelectedContent] = useState<MetaContentRow | null>(null);

  // Helper to compute AI Quality Score badge (0 - 100)
  const getAiQualityBadge = (item: MetaContentRow) => {
    const ctr = item.ctr || 1.5;
    const messages = item.messagesNew || 0;
    const spend = item.spend || 0;
    const cptn = messages > 0 ? spend / messages : 999000;

    let score = Math.round(ctr * 25 + (messages > 5 ? 30 : messages * 5));
    if (cptn < 60000) score += 20;
    else if (cptn > 120000) score -= 15;
    
    score = Math.max(35, Math.min(98, score));

    if (score >= 80) {
      return { score, label: "Xuất Sắc", bg: "bg-emerald-100 text-emerald-800 border-emerald-300" };
    } else if (score >= 60) {
      return { score, label: "Tốt", bg: "bg-sky-100 text-sky-800 border-sky-300" };
    } else {
      return { score, label: "Cần Tối Ưu", bg: "bg-amber-100 text-amber-800 border-amber-300" };
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4 font-mono">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-stone-900 font-sans">
            Phân Tích Nội Dung Quảng Cáo (Ad Creatives &amp; Video Funnel)
          </h3>
          <p className="text-[11px] text-stone-500">
            Đánh giá điểm chất lượng AI, phễu giữ chân Video &amp; link trực tiếp bài viết Meta.
          </p>
        </div>
        <span className="text-xs font-bold text-[#0d4f4a] bg-[#0d4f4a]/10 px-3 py-1 rounded-xl">
          {contentAds.length} Quảng cáo
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contentAds.length === 0 ? (
          <div className="col-span-full p-8 text-center text-stone-400 border border-dashed rounded-2xl">
            Chưa có dữ liệu nội dung quảng cáo khớp bộ lọc.
          </div>
        ) : (
          contentAds.map((item, idx) => {
            const aiBadge = getAiQualityBadge(item);
            return (
              <div
                key={idx}
                className="p-4 border border-stone-200 rounded-2xl space-y-3 hover:border-[#0d4f4a] transition-all bg-stone-50/50 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-[#0d4f4a]/10 text-[#0d4f4a] text-[10px] font-bold uppercase">
                      {item.format || "VIDEO / POST"}
                    </span>

                    {/* AI Quality Score Badge */}
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 ${aiBadge.bg}`}>
                      <Sparkles size={11} />
                      <span>AI: {aiBadge.score}/100 ({aiBadge.label})</span>
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-stone-900 line-clamp-2 leading-snug">
                    {item.hook || item.content_text || item.ad_name || "Nội dung quảng cáo Meta"}
                  </h4>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-stone-200">
                    <div>
                      <span className="text-stone-500 block">Chi tiêu:</span>
                      <strong className="text-stone-900">{(item.spend || 0).toLocaleString("vi-VN")} ₫</strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block">TN mới:</span>
                      <strong className="text-[#0d4f4a]">{item.messagesNew || 0}</strong>
                    </div>
                  </div>

                  {/* Video Funnel preview */}
                  <div className="space-y-1 bg-white p-2 rounded-xl border border-stone-200">
                    <div className="flex items-center justify-between text-[10px] text-stone-500 mb-1">
                      <span className="flex items-center gap-1">
                        <Video size={12} className="text-[#0d4f4a]" /> Phễu giữ chân Video
                      </span>
                      <span className="font-bold text-stone-700">100% ➔ 20%</span>
                    </div>
                    <div className="flex items-end gap-1 h-5 bg-stone-100 p-1 rounded-lg">
                      <div className="bg-[#0d4f4a] w-full rounded-xs" style={{ height: "100%" }} title="25% View" />
                      <div className="bg-[#0d4f4a] w-full rounded-xs" style={{ height: "72%" }} title="50% View" />
                      <div className="bg-[#0d4f4a] w-full rounded-xs" style={{ height: "48%" }} title="75% View" />
                      <div className="bg-[#0d4f4a] w-full rounded-xs" style={{ height: "30%" }} title="95% View" />
                      <div className="bg-[#0d4f4a] w-full rounded-xs" style={{ height: "18%" }} title="100% View" />
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedContent(item)}
                    className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <Eye size={14} />
                    <span>Xem chi tiết &amp; Link FB</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Content Modal Detail View */}
      {selectedContent && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl font-mono relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setSelectedContent(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-900 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2">
              <span className="p-2 bg-[#0d4f4a]/10 text-[#0d4f4a] rounded-xl">
                <FileText size={18} />
              </span>
              <h3 className="font-bold text-base text-stone-900">Chi Tiết Nội Dung Quảng Cáo Meta</h3>
            </div>

            <div className="p-3.5 bg-stone-50 border rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-stone-400 block uppercase">Nội dung văn bản / Hook</span>
              <p className="text-xs text-stone-800 font-sans leading-relaxed">
                {selectedContent.content_text || selectedContent.hook || selectedContent.ad_name || "Không có nội dung mô tả."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-400 block text-[10px]">Campaign:</span>
                <strong className="text-stone-900 truncate block">{selectedContent.campaign_name || "—"}</strong>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-400 block text-[10px]">Chi tiêu:</span>
                <strong className="text-[#0d4f4a]">{(selectedContent.spend || 0).toLocaleString("vi-VN")} ₫</strong>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-400 block text-[10px]">Tin nhắn mới:</span>
                <strong className="text-stone-900">{selectedContent.messagesNew || 0}</strong>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-100">
                <span className="text-stone-400 block text-[10px]">KHTN (Leads):</span>
                <strong className="text-emerald-700">{selectedContent.leads || 0}</strong>
              </div>
            </div>

            <div className="pt-3 border-t flex items-center justify-end gap-2">
              {selectedContent.facebook_url ? (
                <a
                  href={selectedContent.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#0d4f4a] hover:bg-[#083b37] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <ExternalLink size={14} />
                  <span>Mở bài viết Facebook</span>
                </a>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 bg-stone-200 text-stone-500 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-not-allowed"
                >
                  <ExternalLink size={14} />
                  <span>Chưa kết nối Post URL</span>
                </button>
              )}
              <button
                onClick={() => setSelectedContent(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
