// Renders AI message content with smart layout detection.
// Detects numbered-list/directory responses and renders them as visual cards.
// Falls back to plain whitespace-pre-wrap text for conversational responses.

// Parses a response into numbered entries if the content is a structured list.
// Returns an array of { num, title, details[] } or null if not a list.
function parseListEntries(text) {
  const entryRe = /^(\d{1,3})[.)]\s+(.+)/;
  const lines   = text.split('\n');

  const entries = [];
  let current   = null;

  for (const line of lines) {
    const m = line.match(entryRe);
    if (m) {
      if (current) entries.push(current);
      current = { num: +m[1], title: m[2].trim(), details: [] };
    } else if (current) {
      const trimmed = line.trim();
      if (trimmed) current.details.push(trimmed);
    }
  }
  if (current) entries.push(current);

  // Only activate card rendering when there are 3 or more numbered entries
  return entries.length >= 3 ? entries : null;
}

function EntryCard({ entry }) {
  return (
    <div className="rounded-xl border border-black/8 bg-black/[0.025] px-3 py-2.5">
      <div className="flex items-start gap-2.5">
        <span className="shrink-0 mt-0.5 text-[10px] font-bold text-accent bg-accent/10 rounded-md w-5 h-5 flex items-center justify-center leading-none">
          {entry.num}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-snug break-words">{entry.title}</p>
          {entry.details.length > 0 && (
            <div className="mt-1.5 space-y-0.5">
              {entry.details.map((d, i) => (
                <p key={i} className="text-xs text-black/55 leading-relaxed break-words">{d}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MessageContent({ content }) {
  const entries = parseListEntries(content);

  if (entries) {
    return (
      <div className="space-y-2">
        {entries.map((e) => (
          <EntryCard key={e.num} entry={e} />
        ))}
      </div>
    );
  }

  return <span className="whitespace-pre-wrap break-words">{content}</span>;
}
