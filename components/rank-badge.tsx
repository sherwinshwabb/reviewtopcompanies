export function RankBadge({ rank }: { rank: number }) {
  return (
    <span className="rank-badge" data-rank={rank}>
      <span className="sr-only">Rank </span>
      <span aria-hidden="true">#</span>
      {rank}
    </span>
  );
}
