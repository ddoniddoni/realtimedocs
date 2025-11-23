import BoardClient from "./board-client";
import { getMyTrips } from "./queries";

export default async function BoardPage() {
  const { trips, error } = await getMyTrips();

  if (error === "NOT_AUTH") {
    return (
      <main className="flex flex-1 flex-col pt-3">
        <p className="px-3 text-sm">로그인이 필요합니다.</p>
      </main>
    );
  }

  if (error) {
    console.error("load trips error:", error);
    return (
      <main className="flex flex-1 flex-col pt-3">
        <p className="px-3 text-sm text-red-500">
          여행 목록을 불러오는데 실패했습니다.
        </p>
      </main>
    );
  }

  return <BoardClient trips={trips} />;
}
