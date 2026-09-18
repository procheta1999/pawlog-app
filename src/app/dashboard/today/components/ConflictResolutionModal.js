"use client";

import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import Modal from '../../components/Modal';
import RadioGroup from '../../components/RadioGroup';
import ConflictResolutionOption from './ConflictResolutionOption';
import { formatCareEventType } from '@/app/utils/eventUtils';
import styles from './ConflictResolutionModal.module.css';

const resolutionOptions = [
  {
    value: 'recordA',
    label: 'Keep Record A',
    description: 'Keep the current event and discard the new changes.',
  },
  {
    value: 'recordB',
    label: 'Use Record B',
    description: 'Update the current event with the new details.',
  },
  {
    value: 'keepBoth',
    label: 'Keep both records',
    description: 'Create the new event and keep the current event unchanged.',
  },
];

function EventRecord({ label, event }) {
  return (
    <Box className={styles.record}>
      <Typography variant="subtitle1" fontWeight={700}>{label}</Typography>
      <Typography>{dayjs(event.eventTime).format('HH:mm')}</Typography>
      <Typography>{event.description || formatCareEventType(event.eventType)}</Typography>
      {event.quantityDetails && <Typography color="text.secondary">{event.quantityDetails}</Typography>}
      {event.notes && <Typography color="text.secondary">{event.notes}</Typography>}
      <Typography className={styles.status}>
        Status: {formatCareEventType(event.status)}
      </Typography>
    </Box>
  );
}

export default function ConflictResolutionModal({
  open,
  recordA,
  recordB,
  onClose,
  onResolve,
}) {
  const [resolution, setResolution] = useState('recordA');
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setResolution('recordA');
    onClose();
  };

  const handleResolve = async () => {
    setLoading(true);
    try {
      await onResolve(resolution);
      setResolution('recordA');
    } finally {
      setLoading(false);
    }
  };

  if (!recordA || !recordB) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      isForm={false}
      contentClassName={styles.conflictModal}
    >
      <Box className={styles.header}>
        <Typography id="edit-modal-title" variant="h6" fontWeight={700}>
          Review conflicting records
        </Typography>
        <IconButton aria-label="Close conflict resolution" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Alert severity="warning">
        These records may describe different outcomes. Choose how you want to handle this update.
      </Alert>

      <Typography fontWeight={700}>
        {formatCareEventType(recordA.eventType)} · {dayjs(recordA.eventDate).format('ddd, D MMM YYYY')}
      </Typography>

      <Box className={styles.records}>
        <EventRecord label="Record A (current)" event={recordA} />
        <EventRecord label="Record B (new)" event={recordB} />
      </Box>

      <RadioGroup
        id="conflict-resolution"
        ariaLabel="Conflict resolution options"
        value={resolution}
        onChange={setResolution}
        options={resolutionOptions}
        renderOptionLabel={(option) => <ConflictResolutionOption {...option} />}
      />

      <Box className={styles.actions}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleResolve} loading={loading}>
          Resolve conflict
        </Button>
      </Box>
    </Modal>
  );
}
