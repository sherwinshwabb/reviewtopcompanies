/** Top three get a medal; everything below is a plain, quieter number. */
export function RankBadge({ rank, of }: { rank: number; of?: number }) {
  const top = rank <= 3;
  return (
    <span
      className={top ? "rank-badge" : "rank-badge rank-badge-rest"}
      data-rank={rank}
    >
      <span className="sr-only">Ranked </span>
      <span aria-hidden="true">#</span>
      {rank}
      {of ? <span className="sr-only"> of {of}</span> : null}
    </span>
  );
}
