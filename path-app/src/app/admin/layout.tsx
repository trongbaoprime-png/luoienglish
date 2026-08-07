"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FileCode,
  Bot,
  Share2,
  ArrowLeft,
  Layers,
  Image as ImageIcon,
  ShoppingBag,
  Tag,
  Mail,
  Users,
  Shield,
  Activity,
  Settings,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Menu as MenuIcon,
  Puzzle,
  Bell,
  Search,
  User as UserIcon,
  LogOut,
  CheckCircle2,
} from "lucide-react";

interface MenuItem {
  title: string;
  href: string;
  icon: any;
}

interface MenuGroup {
  id: string;
  groupTitle: string;
  icon: any;
  items: MenuItem[];
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, render children directly without header or sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // State to manage expanded/collapsed tree folders
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    content: true,
    commerce: true,
    customers: true,
    system: true,
  });

  // State for logged-in user profile
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: string;
    avatar?: string;
  }>({
    name: "Beni",
    email: "admin@luoidonnha.com",
    role: "ADMIN",
  });

  // State for user profile dropdown
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Fetch active admin user from API or localStorage
  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          const adminUser = data.data.find((u: any) => u.role === "ADMIN") || data.data[0];
          if (adminUser) {
            setCurrentUser({
              name: adminUser.name,
              email: adminUser.email,
              role: adminUser.role,
              avatar: adminUser.avatar,
            });
          }
        }
      })
      .catch(() => {});
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    if (confirm(`Bạn có chắc chắn muốn đăng xuất khỏi tài khoản ${currentUser.name}?`)) {
      router.push("/");
    }
  };


  const menuGroups: MenuGroup[] = [
    {
      id: "content",
      groupTitle: "QUẢN LÝ NỘI DUNG",
      icon: FileText,
      items: [
        { title: "Bài viết", href: "/admin/articles", icon: FileText },
        { title: "Pages", href: "/admin/pages", icon: FileCode },
        { title: "Shortcode", href: "/admin/shortcodes", icon: Puzzle },
        { title: "Media", href: "/admin/media", icon: ImageIcon },
        { title: "Danh mục", href: "/admin/categories", icon: Layers },
        { title: "Menu", href: "/admin/menus", icon: MenuIcon },
      ],
    },
    {
      id: "commerce",
      groupTitle: "THƯƠNG MẠI & AFFILIATE",
      icon: ShoppingBag,
      items: [
        { title: "Sản phẩm Affiliate", href: "/admin/products", icon: ShoppingBag },
        { title: "Voucher & Deal Hot", href: "/admin/deals", icon: Tag },
      ],
    },
    {
      id: "customers",
      groupTitle: "KHÁCH HÀNG & CRM LEAD",
      icon: Mail,
      items: [
        { title: "miniCRM", href: "/admin/crm", icon: Users },
        { title: "Khách đăng ký", href: "/admin/raw-leads", icon: FileText },
        { title: "Omnichannel & AI Agent", href: "/admin/omnichannel", icon: Bot },
        { title: "Hòm thư Liên hệ", href: "/admin/inbox", icon: Mail },
        { title: "Email Subscribers", href: "/admin/subscribers", icon: Users },
      ],
    },
    {
      id: "system",
      groupTitle: "HỆ THỐNG & PHÂN QUYỀN",
      icon: Shield,
      items: [
        { title: "Quản lý Users", href: "/admin/users", icon: Shield },
        { title: "Audit Logs & Webhooks", href: "/admin/audit-logs", icon: Activity },
        { title: "Trợ lý AI Gemini", href: "/admin/ai-tools", icon: Bot },
        { title: "Multi-Platform Ads APIs", href: "/admin/ads-setup", icon: Share2 },
        { title: "Cài đặt Hệ thống", href: "/admin/settings", icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex flex-col font-sans">
      {/* Sleek Top Header with Ocean Aquamarine Accent & User Profile */}
      <header className="h-14 bg-white border-b border-stone-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2 font-bold font-serif text-sm text-stone-900">
            <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#00c9b7] to-[#06b6d4] text-slate-950 flex items-center justify-center font-sans font-black text-xs shadow-sm">
              L
            </span>
            <span>
              LƯỜI DỌN NHÀ{" "}
              <span className="text-[9px] bg-teal-50 text-[#00c9b7] border border-teal-200 px-1.5 py-0.5 rounded font-mono uppercase font-bold ml-1">
                Admin Portal
              </span>
            </span>
          </Link>
        </div>

        {/* Header Right Actions & User Profile */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 text-stone-700 font-semibold text-xs hover:bg-stone-50 transition-colors shadow-2xs"
          >
            <ArrowLeft size={13} />
            <span>← Xem Website</span>
          </Link>

          <div className="h-4 w-px bg-stone-200 hidden sm:block" />

          {/* Quick Notification Icons */}
          <button className="relative p-2 text-stone-500 hover:text-[#00c9b7] hover:bg-stone-100 rounded-xl transition-colors">
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00c9b7] rounded-full ring-2 ring-white" />
          </button>

          <button className="relative p-2 text-stone-500 hover:text-[#00c9b7] hover:bg-stone-100 rounded-xl transition-colors">
            <Mail size={17} />
          </button>

          {/* User Profile Dropdown Button */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-stone-100 transition-all border border-transparent hover:border-stone-200 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00c9b7] to-[#06b6d4] text-slate-950 font-black text-xs flex items-center justify-center shadow-sm border border-white uppercase">
                {currentUser.name.slice(0, 2)}
              </div>
              <div className="text-left hidden md:block leading-tight">
                <div className="text-xs font-bold text-stone-900 flex items-center gap-1">
                  <span>{currentUser.name}</span>
                  <span className="text-[9px] bg-teal-100 text-[#00c9b7] font-mono px-1 py-0.2 rounded font-extrabold uppercase">
                    {currentUser.role}
                  </span>
                </div>
                <div className="text-[10px] text-stone-500">Quản trị viên</div>
              </div>
              <ChevronDown size={14} className={`text-stone-400 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 border-b border-stone-100">
                  <p className="text-xs font-bold text-stone-900">{currentUser.name} ({currentUser.role})</p>
                  <p className="text-[11px] text-stone-500 font-mono">{currentUser.email}</p>
                </div>

                <div className="py-1">
                  <Link
                    href="/admin/users"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-700 hover:bg-teal-50 hover:text-[#00c9b7] transition-colors"
                  >
                    <UserIcon size={14} />
                    <span>Thông tin tài khoản</span>
                  </Link>
                  <Link
                    href="/admin/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-stone-700 hover:bg-teal-50 hover:text-[#00c9b7] transition-colors"
                  >
                    <Settings size={14} />
                    <span>Cài đặt Hệ thống</span>
                  </Link>
                </div>

                <div className="border-t border-stone-100 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left cursor-pointer"
                  >
                    <LogOut size={14} />
                    <span>Đăng xuất (Logout)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sleek Ocean Aquamarine Dark Sidebar */}
        <aside className="w-60 bg-[#063935] text-[#e6f4f2] border-r border-[#032522] p-3 space-y-3 hidden md:block shadow-md shrink-0 select-none">
          {/* Main Dashboard Link */}
          <div>
            <Link
              href="/admin"
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-xs transition-all ${
                pathname === "/admin"
                  ? "bg-gradient-to-r from-[#00c9b7] to-[#06b6d4] text-slate-950 font-black shadow-sm"
                  : "text-teal-100/90 hover:bg-[#0b4d47] hover:text-white"
              }`}
            >
              <LayoutDashboard size={15} className={pathname === "/admin" ? "text-slate-950" : "text-[#2dd4bf]"} />
              <span>Tổng quan Dashboard</span>
            </Link>
          </div>

          {/* Group Sections */}
          <div className="space-y-2.5 pt-1">
            {menuGroups.map((group) => {
              const isOpen = openGroups[group.id];

              return (
                <div key={group.id} className="space-y-1">
                  {/* Folder Group Header Toggle */}
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold text-teal-200/90 uppercase tracking-wider hover:bg-[#0b4d47] hover:text-white transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      {isOpen ? (
                        <FolderOpen size={14} className="text-[#2dd4bf]" />
                      ) : (
                        <Folder size={14} className="text-teal-400/60" />
                      )}
                      <span>{group.groupTitle}</span>
                    </div>
                    {isOpen ? <ChevronDown size={13} className="text-[#2dd4bf]" /> : <ChevronRight size={13} className="text-teal-400/60" />}
                  </button>

                  {/* Folder Items */}
                  {isOpen && (
                    <div className="pl-3 space-y-0.5 border-l-2 border-[#0d5952] ml-2.5">
                      {group.items.map((item) => {
                        const ItemIcon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                              isActive
                                ? "bg-gradient-to-r from-[#00c9b7] to-[#06b6d4] text-slate-950 font-black shadow-xs"
                                : "text-teal-100/90 font-medium hover:bg-[#0b4d47] hover:text-white"
                            }`}
                          >
                            <ItemIcon size={13} className={isActive ? "text-slate-950" : "text-[#2dd4bf]/80"} />
                            <span>{item.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Fluid Full-Width Main Content Area */}
        <main className="flex-1 p-3 md:p-4 lg:p-4 w-full overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
