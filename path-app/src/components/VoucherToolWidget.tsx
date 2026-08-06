"use client";

import { useState, useEffect } from "react";
import { Tag, Copy, Check, ExternalLink, Sparkles } from "lucide-react";

interface DealItem {
  id: string;
  code: string;
  title: string;
  discount: string;
  merchant: string;
  affiliateUrl: string;
  isHot?: boolean;
}

export default function VoucherToolWidget() {
  const [deals, setDeals] = useState<DealItem[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/deals")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setDeals(data);
      })
      .catch(() => null);
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section id="tool-widget" className="py-8 px-4 max-w-[1150px] mx-auto w-full">
      {/* Dynamic Voucher & Hot Deal List */}
      {deals.length > 0 && (
        <div className="mb-10 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
            <Sparkles className="w-5 h-5 text-[#0d9488]" />
            <h3 className="text-xl font-bold text-stone-900">Mã Giảm Giá & Deal Hot Hôm Nay</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {deals.slice(0, 6).map((deal) => (
              <div
                key={deal.id}
                className="p-4 rounded-xl border border-stone-100 bg-stone-50 hover:border-[#0d9488]/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#ccfbf1] text-[#0d9488]">
                      {deal.merchant}
                    </span>
                    {deal.isHot && (
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        🔥 HOT
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold text-stone-800 text-sm mb-1">{deal.title}</h4>
                  <p className="text-xs text-stone-500 mb-3">{deal.discount}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-200/60">
                  <span className="font-mono text-xs font-bold text-stone-700 bg-white px-2 py-1 rounded border border-stone-200">
                    {deal.code}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopy(deal.code)}
                      className="p-1.5 text-stone-600 hover:text-[#0d9488] transition-colors"
                      title="Copy mã"
                    >
                      {copiedCode === deal.code ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <a
                      href={`/api/affiliate/click?url=${encodeURIComponent(deal.affiliateUrl)}&merchant=${deal.merchant}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-stone-600 hover:text-[#0d9488] transition-colors"
                      title="Dùng ngay"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Embedded Converter Widget */}
      <div className="bg-white p-0 sm:p-2 rounded-2xl border border-stone-200 shadow-sm overflow-hidden w-full">
        <div className="w-full bg-transparent overflow-hidden min-h-[600px] h-[600px] sm:h-[620px] relative">
          <iframe
            src="https://qini-home.afp.ad"
            title="Shopee Link Converter Tool"
            className="w-full h-[720px] border-0 outline-none -mb-28"
            style={{ border: "none", outline: "none" }}
            scrolling="no"
            allow="clipboard-read; clipboard-write"
          />
        </div>
      </div>
    </section>
  );
}
