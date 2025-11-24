import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

import { useCountries } from "@lib/hooks/use-contries";
import { cn } from "@/lib/utils";

type TripCardProps = {
  id: string;
  name: string;
  country: string;
  created_at?: string;
};

export default function TripCard(props: TripCardProps) {
  const { id, name, country, created_at } = props;
  const router = useRouter();
  const { getByValue } = useCountries();
  const countryInfo = getByValue(country);

  const createdDate = created_at
    ? format(new Date(created_at), "yyyy.MM.dd", { locale: ko })
    : null;

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-linear-to-br",
        "from-slate-50 via-white to-slate-100",
        "shadow-sm hover:shadow-md hover:shadow-slate-200",
        "transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
      )}
      onClick={() => router.push(`/trips/${id}`)} // 클릭 → 상세 페이지 이동
    >
      {/* 상단 배지 영역 */}
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
          <span className="text-base">{countryInfo?.flag ?? "🌍"}</span>
          <span>{countryInfo?.label ?? country}</span>
        </div>

        {createdDate && (
          <span className="rounded-full bg-slate-900/5 px-3 py-1 text-[10px] font-medium text-slate-500">
            생성 {createdDate}
          </span>
        )}
      </div>

      {/* 본문 */}
      <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
        <h2 className="line-clamp-2 text-base font-semibold text-slate-900">
          {name}
        </h2>

        <p className="mt-2 text-xs text-slate-500">
          여행 상세 페이지에서 메모, 일정, 체크리스트 등을 관리할 수 있어요.
        </p>

        {/* 하단 */}
        <div className="mt-4 inline-flex items-center gap-1 text-xs text-slate-600">
          <span className="opacity-60">자세히 보기</span>
          <span className="text-[10px] opacity-60">→</span>
        </div>
      </div>
    </article>
  );
}
