import React from 'react';
import LeadsKanbanPage from '../LeadsKanbanPage'; 
import { ComunicacaoProvider } from '../../contexts/ComunicacaoContext';

export default function KanbanPageWrapper() {
  return (
    <ComunicacaoProvider>
      <LeadsKanbanPage />
    </ComunicacaoProvider>
  );
} 