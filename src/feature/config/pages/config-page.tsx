import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAlert } from "@/hooks/use-alert";
import type { SettingsDTO } from "@/feature/config/services/settings-service";
import { useSettingsStore } from "@/feature/config/store/settings-store";
import { AuthStore } from "@/feature/auth/stores/auth-store";
import { AgendaTab } from "@/feature/config/pages/components/agenda-tab";
import { BillingTab } from "@/feature/config/pages/components/billing-tab";
import { BrandingTab } from "@/feature/config/pages/components/branding-tab";
import { CompanyTab } from "@/feature/config/pages/components/company-tab";

const tabs = [
    { id: "company", label: "Perfil da empresa" },
    { id: "agenda", label: "Preferências da agenda" },
    { id: "billing", label: "Cobrança e plano" },
    { id: "branding", label: "Personalização" },
] as const;

export const ConfigPage = () => {
    const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("company");
    const { showAlert } = useAlert();
    const { settings, loading, setSettings, fetchSettings, updateSettings, fetchCompanyInfo, company } = useSettingsStore();

    const tabContent = useMemo(() => {
        return {
            company: <CompanyTab settings={settings} onChange={(patch) => setSettings(patch)} company={company} />,
            agenda: <AgendaTab settings={settings} onChange={(patch) => setSettings(patch)} />,
            billing: <BillingTab />,
            branding: <BrandingTab settings={settings} onChange={(patch) => setSettings(patch)} />,
        } as const;
    }, [setSettings, settings, company]);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                await fetchSettings();
                const authUserId = AuthStore.getState().user?.id;
                if (authUserId) await fetchCompanyInfo(authUserId);
            } catch (error) {
                console.error(error);
                showAlert({ title: "Erro", message: "Não foi possível carregar as configurações", type: "error" });
            }
        };

        loadSettings();
    }, [fetchSettings, fetchCompanyInfo, settings.company_id, showAlert]);

    const handleSave = async () => {
        try {
            const payload: SettingsDTO = {
                brand_name: settings.brand_name?.trim() || null,
                primary_color: settings.primary_color?.trim() || null,
                secondary_color: settings.secondary_color?.trim() || null,
                logo_url: settings.logo_url?.trim() || null,
                favicon_url: settings.favicon_url?.trim() || null,
                custom_domain: settings.custom_domain?.trim() || null,
                email_from_name: settings.email_from_name?.trim() || null,
                email_from_address: settings.email_from_address?.trim() || null,
                public_start_time: settings.public_start_time?.trim() || null,
                public_end_time: settings.public_end_time?.trim() || null,
                public_slot_minutes: settings.public_slot_minutes ?? null,
                public_working_days: settings.public_working_days?.trim() || null,
                segment: settings.segment?.trim() || null,
                phone: settings.phone?.trim() || null,
                email: settings.email?.trim() || null,
            };
            await updateSettings(payload);
            showAlert({ title: "Sucesso", message: "Configurações salvas", type: "success" });
        } catch (error) {
            console.error(error);
            showAlert({ title: "Erro", message: "Não foi possível salvar as configurações", type: "error" });
        }
    };

    return (
        <div className="container mx-auto px-4 py-6 sm:py-8 space-y-6">
            <div>
                <h1 className="text-xl sm:text-2xl font-semibold">Configurações</h1>
                <p className="text-sm text-muted-foreground">Gerencie as preferências da sua conta</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                {tabs.map((tab) => (
                    <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? "default" : "outline"}
                        onClick={() => setActiveTab(tab.id)}
                        className="w-full sm:w-auto"
                    >
                        {tab.label}
                    </Button>
                ))}
                <div className="sm:ml-auto">
                    <Button onClick={handleSave} disabled={loading} className="w-full sm:w-auto">
                        {loading ? "Salvando..." : "Salvar"}
                    </Button>
                </div>
            </div>
            {tabContent[activeTab]}
        </div>
    );
};
