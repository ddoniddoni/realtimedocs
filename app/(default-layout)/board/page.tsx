import BoardClient from "./board-client";
import { getMyTrips } from "./queries";

export default async function BoardPage() {
  const { trips, error } = await getMyTrips();

  return (
    <main className="flex flex-1 flex-col pt-3">
      {error ? (
        <section aria-labelledby="board-error-title" className="px-3 py-8">
          <h1 id="board-error-title" className="text-base font-semibold">
            여행 목록을 불러오지 못했어요.
          </h1>
          <p className="mt-2 text-sm text-red-500">
            잠시 후 다시 시도해주세요. 문제가 계속되면 관리자에게 문의해주세요.
          </p>
        </section>
      ) : (
        <BoardClient trips={trips} />
      )}
    </main>
  );
}
