import React from 'react';
import { BaseConhecimento } from '../components/conhecimento/BaseConhecimento';
import { Container } from '@edunexia/ui-components';

function BaseConhecimentoPage() {
  return (
    <Container>
      <div className="py-6">
        <BaseConhecimento />
      </div>
    </Container>
  );
}

export default BaseConhecimentoPage; 