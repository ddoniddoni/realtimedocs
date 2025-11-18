export function Copyright() {
  return (
    <footer className="flex flex-col items-center justify-center gap-1 h-16 text-center bg-muted border-t border-border">
      <h2 className="hidden-txt">카피라이트</h2>
      <p className="text-md font-medium text-muted-foreground">
        <small>© This. Corp. All Rights Reserved</small>
      </p>
    </footer>
  );
}
Copyright.displayName = "Copyright";
