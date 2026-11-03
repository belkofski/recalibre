import type { Initiative } from '@/content/work';
import type { WorkCardItem } from '@/components/WorkCard';

/** An initiative (content/work.ts) as the work card draws it. One mapping,
 *  used by the projects index, the case pages' "more" pair and the service
 *  pages' related work, so the same project is the same card everywhere. */
export function toCard(item: Initiative): WorkCardItem {
  return {
    slug: item.slug,
    name: item.name,
    status: item.status,
    /* The state is the meta line's last term; the card prints it as the
       Status, on a line of its own. */
    meta: `${item.year} · ${item.category} · ${item.state}`.toUpperCase(),
    demo: item.demo,
    tags: item.tags,
    src: item.cover,
    srcTall: item.coverTall,
    srcTallMobileOnly: item.coverTallMobileOnly,
    srcCard: item.coverCard,
    alt: item.coverAlt,
    figure: item.figure,
    art: item.art,
    plate: item.plate,
    mark: item.mark,
    markTone: item.markTone,
    tone: item.tone,
    summary: item.summary,
  };
}
