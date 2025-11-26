// app/(default-layout)/my-trip/[tripId]/invite-friend-button.tsx
"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { inviteFriendAction } from "@/app/(default-layout)/my-trip/[id]/actions";

type InviteFriendButtonProps = {
  tripId: string;
};

export function InviteFriendButton({ tripId }: InviteFriendButtonProps) {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInvite = () => {
    if (!email) {
      setError("이메일을 입력해 주세요.");
      return;
    }

    startTransition(async () => {
      setError(null);
      setSuccess(null);

      const res = await inviteFriendAction({ tripId, email });

      if (!res.ok) {
        switch (res.error) {
          case "NOT_AUTH":
            setError("로그인이 필요합니다.");
            break;
          case "NOT_OWNER":
            setError("이 여행의 소유자만 동행자를 초대할 수 있습니다.");
            break;
          default:
            setError(res.error ?? "초대 중 오류가 발생했습니다.");
        }
        return;
      }

      setSuccess("초대 요청이 완료되었습니다.");
      setEmail("");
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          동행 초대하기
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-sky-300">동행 초대</DialogTitle>
          <DialogDescription>
            같이 일정을 짤 동행의 이메일을 입력해 주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <label className="block text-sm text-sky-300 font-medium">
            이메일
          </label>
          <Input
            type="email"
            className="text-sky-200 placeholder:text-gray-200"
            placeholder="friend@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p className="text-xs text-red-500">{error}</p>}
          {success && <p className="text-xs text-emerald-600">{success}</p>}
        </div>

        <DialogFooter>
          <Button type="button" onClick={handleInvite} disabled={isPending}>
            {isPending ? "초대 중..." : "초대 보내기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
