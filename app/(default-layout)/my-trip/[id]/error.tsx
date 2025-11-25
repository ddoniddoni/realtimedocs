"use client";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function MyTripError({ error, reset }: ErrorProps) {
  return (
    <main className="flex flex-1 flex-col px-4 py-4 gap-3">
      <h1 className="text-lg font-semibold">
        페이지를 불러오는 중 오류가 발생했어요.
      </h1>
      <p className="text-sm text-red-500">
        {error.message || "알 수 없는 오류입니다."}
      </p>
      <button
        onClick={reset}
        className="mt-2 inline-flex h-9 items-center rounded-md border px-3 text-sm"
      >
        다시 시도
      </button>
    </main>
  );
}
