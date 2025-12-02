import { getTripDetail } from "./queries";
import MyTripClient from "./my-trip-client";

type MyTripPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MyTripPage({ params }: MyTripPageProps) {
  const { id } = await params; // Next 15: params는 Promise
  const tripId = id;

  const { data, error } = await getTripDetail(tripId);
  if (error === "NOT_AUTH") {
    return (
      <main className="flex flex-1 flex-col px-4 pt-4">
        <p className="text-sm text-red-500">로그인이 필요합니다.</p>
      </main>
    );
  }

  if (error === "NOT_FOUND") {
    return (
      <main className="flex flex-1 flex-col px-4 pt-4">
        <p className="text-sm">해당 여행을 찾을 수 없습니다.</p>
      </main>
    );
  }

  if (error && typeof error === "object") {
    throw new Error(error.message ?? "알 수 없는 오류가 발생했습니다.");
  }

  if (!data) {
    throw new Error("여행 데이터를 불러오지 못했습니다.");
  }

  return (
    <>
      <MyTripClient data={data} />
    </>
  );
}
