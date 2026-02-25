import { NavLink } from "react-router-dom";
import { Calendar, ShieldCheck } from "lucide-react";
import { cn } from "../lib/utils";
import { menuItens } from "../shared/navigation/menu";
import { AuthStore } from "@/feature/auth/stores/auth-store";
import { useSettingsStore } from "@/feature/config/store/settings-store";
import { Sidebar, SidebarContent } from "./ui/sidebar";
import { getSegmentLabels, isCasesEnabled } from "@/shared/segments/segment-labels";

export const SideBarComponents = () => {
  const { user } = AuthStore();
  const { settings } = useSettingsStore()
  const role = (user?.tipoConta ?? "").toUpperCase();
  const labels = getSegmentLabels(settings?.segment);

  const visibleItems = menuItens.filter((item) => {
    if (item.label === "Casos" && !isCasesEnabled(settings?.segment)) return false;
    return !item.roles || item.roles.map((r) => r.toUpperCase()).includes(role);
  });

  const brandName = settings?.brand_name ?? "AgendaPro";

  const resolveLabel = (label: string) => {
    switch (label) {
      case "Clientes":
        return labels.clients.plural;
      case "Profissionais":
        return labels.professionals.plural;
      case "Serviços":
        return labels.services.plural;
      case "Agenda":
        return labels.appointments.plural;
      case "Casos":
        return labels.cases.plural;
      default:
        return label;
    }
  };


  return (
    <Sidebar className="bg-white border-r border-slate-200/80">
      <div className="h-20 flex items-center justify-between px-5 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
          <Calendar size={20} />
        </div>
        <span className="font-semibold text-lg tracking-tight">{brandName}</span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-1 text-[11px] text-slate-600">
          <ShieldCheck className="h-3 w-3" />
          Pro
        </span>
      </div>

      <SidebarContent className="px-3 py-4">
        <nav className="flex flex-col gap-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition border border-transparent",
                    isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "text-slate-600 hover:bg-slate-100 hover:border-slate-200"
                  )
                }
              >
                <Icon size={18} />
                {resolveLabel(item.label)}
              </NavLink>
            );
          })}
        </nav>
      </SidebarContent>
    </Sidebar>
  );
};
