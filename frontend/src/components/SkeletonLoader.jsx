export function SkeletonMemberCard() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-slate-200 shimmer" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-3/4 bg-slate-200 rounded shimmer" />
          <div className="h-3 w-1/2 bg-slate-200 rounded shimmer" />
        </div>
      </div>
      <div className="h-16 w-full bg-slate-100 rounded-xl shimmer" />
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 w-20 bg-slate-200 rounded-full shimmer" />
        <div className="h-6 w-16 bg-slate-200 rounded shimmer" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonMemberCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonTreeNode() {
  return (
    <div className="w-52 h-36 rounded-2xl border border-slate-200 bg-white/80 p-4 space-y-3 shimmer">
      <div className="w-10 h-10 rounded-full bg-slate-200 mx-auto" />
      <div className="h-4 w-28 bg-slate-200 rounded mx-auto" />
      <div className="h-3 w-20 bg-slate-200 rounded mx-auto" />
    </div>
  );
}

export default SkeletonMemberCard;
