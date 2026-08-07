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
    <div className="min-h-screen bg-[#12100e] text-[#f3efe6] flex flex-col font-sans">
      {/* Sleek Top Header with Dark Cockpit Theme & User Profile */}
      <header className="h-14 bg-[#1a1714] border-b border-[#292524] px-4 md:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="flex items-center gap-2 font-bold font-serif text-sm text-[#f3efe6]">
            <span className="w-7 h-7 rounded-sm bg-[#0d9488] text-[#12100e] flex items-center justify-center font-sans font-black text-xs shadow-sm">
              L
            </span>
            <span className="tracking-tight">
              LƯỜI CMS{" "}
              <span className="text-[9px] bg-[#0d9488]/15 text-[#14b8a6] border border-[#0d9488]/40 px-1.5 py-0.5 rounded-xs font-mono uppercase font-bold ml-1">
                Cockpit v0.5
              </span>
            </span>
          </Link>
        </div>

        {/* Header Right Actions & User Profile */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs border border-[#292524] text-[#a8a29e] font-mono text-xs hover:border-[#0d9488] hover:text-[#f3efe6] transition-colors"
          >
            <ArrowLeft size={13} />
            <span>← Xem Website</span>
          </Link>

          <div className="h-4 w-px bg-[#292524] hidden sm:block" />

          {/* Quick Notification Icons */}
          <button className="relative p-2 text-[#a8a29e] hover:text-[#0d9488] hover:bg-[#292524] rounded-xs transition-colors">
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#0d9488] rounded-full ring-2 ring-[#1a1714]" />
          </button>

          <button className="relative p-2 text-[#a8a29e] hover:text-[#0d9488] hover:bg-[#292524] rounded-xs transition-colors">
            <Mail size={17} />
          </button>

          {/* User Profile Dropdown Button */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xs hover:bg-[#292524] transition-all border border-transparent hover:border-[#292524] cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xs bg-[#0d9488] text-[#12100e] font-black text-xs flex items-center justify-center shadow-sm uppercase">
                {currentUser.name.slice(0, 2)}
              </div>
              <div className="text-left hidden md:block leading-tight">
                <div className="text-xs font-bold text-[#f3efe6] flex items-center gap-1">
                  <span>{currentUser.name}</span>
                  <span className="text-[9px] bg-[#0d9488]/20 text-[#14b8a6] font-mono px-1 py-0.2 rounded-xs font-extrabold uppercase">
                    {currentUser.role}
                  </span>
                </div>
                <div className="text-[10px] text-[#a8a29e] font-mono">Quản trị viên</div>
              </div>
              <ChevronDown size={14} className={`text-[#a8a29e] transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {/* User Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#1a1714] rounded-xs shadow-2xl border border-[#292524] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 border-b border-[#292524]">
                  <p className="text-xs font-bold text-[#f3efe6]">{currentUser.name} ({currentUser.role})</p>
                  <p className="text-[11px] text-[#a8a29e] font-mono">{currentUser.email}</p>
                </div>

                <div className="py-1">
                  <Link
                    href="/admin/users"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#a8a29e] hover:bg-[#0d9488]/10 hover:text-[#0d9488] transition-colors font-mono"
                  >
                    <UserIcon size={14} />
                    <span>Thông tin tài khoản</span>
                  </Link>
                  <Link
                    href="/admin/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#a8a29e] hover:bg-[#0d9488]/10 hover:text-[#0d9488] transition-colors font-mono"
                  >
                    <Settings size={14} />
                    <span>Cài đặt Hệ thống</span>
                  </Link>
                </div>

                <div className="border-t border-[#292524] pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-950/30 transition-colors text-left cursor-pointer font-mono"
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
        {/* Sleek Dark Teal Cockpit Sidebar (Matches Original LƯỜI CMS Exact Colors) */}
        <aside className="w-64 bg-[#042d2a] text-[#e6f4f1] border-r border-[#084540] p-3 space-y-3 hidden md:block shrink-0 select-none">
          {/* Main Dashboard Link with Cyan Active Pill */}
          <div>
            <Link
              href="/admin"
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-mono font-bold text-xs transition-all ${
                pathname === "/admin"
                  ? "bg-[#00c9b7] text-[#023835] font-black shadow-md"
                  : "text-[#e6f4f1] hover:bg-[#084540] hover:text-[#00c9b7]"
              }`}
            >
              <LayoutDashboard size={16} className={pathname === "/admin" ? "text-[#023835]" : "text-[#00c9b7]"} />
              <span>TỔNG QUAN DASHBOARD</span>
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
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xs text-[10px] font-mono font-extrabold text-[#00c9b7] uppercase tracking-wider hover:bg-[#084540] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      {isOpen ? (
                        <FolderOpen size={14} className="text-[#00c9b7]" />
                      ) : (
                        <Folder size={14} className="text-[#0d9488]" />
                      )}
                      <span>{group.groupTitle}</span>
                    </div>
                    {isOpen ? <ChevronDown size={13} className="text-[#00c9b7]" /> : <ChevronRight size={13} className="text-[#0d9488]" />}
                  </button>

                  {/* Folder Items */}
                  {isOpen && (
                    <div className="pl-3 space-y-0.5 border-l border-[#084540] ml-2.5">
                      {group.items.map((item) => {
                        const ItemIcon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono transition-all ${
                              isActive
                                ? "bg-[#0a4742] text-[#00c9b7] font-bold border border-[#00c9b7]/30"
                                : "text-[#e6f4f1]/80 hover:bg-[#084540] hover:text-[#ffffff]"
                            }`}
                          >
                            <ItemIcon size={14} className={isActive ? "text-[#00c9b7]" : "text-[#00c9b7]/70"} />
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

        {/* Fluid Full-Width Main Content Area (Clean Light / Dark Responsive Canvas) */}
        <main className="flex-1 p-3 md:p-4 lg:p-6 w-full overflow-x-hidden bg-[#fafaf9] text-[#1a1612]">{children}</main>
      </div>
    </div>
  );
}
