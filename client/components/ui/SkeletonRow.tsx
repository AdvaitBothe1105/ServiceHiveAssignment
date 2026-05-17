export default function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-border/60">
      <td className="px-4 py-4">
        <div className="h-4 w-32 rounded bg-muted" />
        <div className="mt-2 h-3 w-40 rounded bg-muted" />
      </td>
      <td className="px-4 py-4">
        <div className="h-6 w-20 rounded-full bg-muted" />
      </td>
      <td className="px-4 py-4">
        <div className="h-4 w-16 rounded bg-muted" />
      </td>
      <td className="px-4 py-4">
        <div className="h-2 w-full rounded-full bg-muted" />
      </td>
      <td className="px-4 py-4">
        <div className="h-4 w-20 rounded bg-muted" />
      </td>
      <td className="px-4 py-4">
        <div className="h-4 w-24 rounded bg-muted" />
      </td>
      <td className="px-4 py-4">
        <div className="h-8 w-16 rounded-full bg-muted" />
      </td>
    </tr>
  );
}
