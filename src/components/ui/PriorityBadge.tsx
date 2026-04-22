import type { Priority } from '../../types/actions';
import { PRIORITY_LABELS } from '../../types/actions';
import { PRIORITY_BG, PRIORITY_TEXT } from '../../utils/statusUtils';

interface Props {
  priority: Priority;
}

export default function PriorityBadge({ priority }: Props) {
  return (
    <span
      style={{
        background: PRIORITY_BG[priority],
        color: PRIORITY_TEXT[priority],
        padding: '3px 10px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
