import { createFileRoute } from "@tanstack/react-router";
import { LeadForm } from "@/components/lead-form";
import { PageIntro, Shell } from "@/components/shell";
import type { LeadRole } from "@/lib/leads";

type RequestSearch = {
  package?: string;
  place?: string;
  service?: string;
  role?: LeadRole;
};

export const Route = createFileRoute("/request")({
  validateSearch: (search: Record<string, unknown>): RequestSearch => {
    const result: RequestSearch = {};
    if (typeof search.package === "string" && search.package) result.package = search.package;
    if (typeof search.place === "string" && search.place) result.place = search.place;
    if (typeof search.service === "string" && search.service) result.service = search.service;
    if (search.role === "customer" || search.role === "business") result.role = search.role;
    return result;
  },
  component: RequestPage,
});

function RequestPage() {
  const search = Route.useSearch();
  return (
    <Shell>
      <PageIntro
        kicker="درخواست"
        title="بگویید مشتری می‌خواهید یا خودتان مشتری‌اید"
        text="صاحب سالن و کلینیک در اولویت پاسخ‌اند. اگر دنبال نوبت هستید، نقش را روی مشتری بگذارید تا بعداً از هم جدا شوند."
      />
      <div className="mx-auto max-w-6xl px-4 pb-14">
        <LeadForm
          initialPackage={search.package}
          initialPlace={search.place}
          initialService={search.service}
          initialRole={search.role}
        />
      </div>
    </Shell>
  );
}
