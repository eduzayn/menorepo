import React from 'react';
import { BaseConhecimento } from '../components/conhecimento/BaseConhecimento';
import { Container } from '../components/ui/container';

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