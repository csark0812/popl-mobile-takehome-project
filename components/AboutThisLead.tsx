import DetailTagsSection from '@components/DetailTagsSection';
import LeadDetailCard from '@components/LeadDetailCard';
import NotesSection from '@components/NotesSection';
import { Lead } from '@types';
import React from 'react';

interface AboutThisLeadProps {
  lead: Lead;
  onAddTag: (newTag: string) => void;
  onRemoveTag: (tagIndex: number) => void;
  onAddNote: () => void;
  onUpdateNote?: (note: string) => void;
}

export default function AboutThisLead({
  lead,
  onAddTag,
  onRemoveTag,
  onUpdateNote,
}: AboutThisLeadProps) {
  return (
    <LeadDetailCard title="About This Lead">
      {/* Tags Section */}
      <DetailTagsSection
        tags={lead.tags}
        leadId={lead.id}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
      />

      {/* Notes Section */}
      <NotesSection
        notes={lead.notes || undefined}
        onUpdateNote={onUpdateNote}
      />
    </LeadDetailCard>
  );
}
