import type { ActionStatus } from '../../types/actions';
import { ACTION_STATUS_LABELS } from '../../types/actions';
import { STATUS_BG, STATUS_TEXT, STATUS_BORDER } from '../../utils/statusUtils';

interface Props {
  status: ActionStatus;
}

export default function StatusBadge({ status }: Props) {
  return (
    <span
      style={{
        background: STATUS_BG[status],
        color: STATUS_TEXT[status],
        border: `1px solid ${STATUS_BORDER[status]}`,
        padding: '3px 10px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {ACTION_STATUS_LABELS[status]}
    </span>
  );
}
