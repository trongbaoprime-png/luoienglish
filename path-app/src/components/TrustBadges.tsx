import { ShieldCheck, Zap, Ticket, Gift } from "lucide-react";

export default function TrustBadges() {
  const badges = [
    {
      icon: <ShieldCheck size={20} className="text-[#0d9488]" />,
      title: "An toàn",
      desc: "Không lưu thông tin cá nhân"
    },
    {
      icon: <Zap size={20} className="text-[#f97316]" />,
      title: "Nhanh chóng",
      desc: "Chuyển đổi tức thì trong 0.5s"
    },
    {
      icon: <Ticket size={20} className="text-[#0284c7]" />,
      title: "Ưu đãi hot",
      desc: "Voucher Facebook giảm đến 25%"
    },
    {
      icon: <Gift size={20} className="text-[#16a34a]" />,
      title: "Miễn phí",
      desc: "Sử dụng hoàn toàn miễn phí"
    }
  ];

  return (
    <section className="bg-white border-y border-[#e7e5e4] py-8">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#fafaf9] border border-[#e7e5e4] flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <h4 className="font-sans font-black text-sm text-[#1c1917]">
                  {item.title}
                </h4>
                <p className="text-xs text-[#78716c]">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
