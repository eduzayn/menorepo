import React from 'react';
import { BaseConhecimento } from '../components/conhecimento/BaseConhecimento';
import { Container } from '../mock-components';

function BaseConhecimentoPage() {
  return (
    <Container>
      <h1 className="text-2xl font-bold mb-6">Base de Conhecimento</h1>
      <BaseConhecimento />
    </Container>
  );
}

export default BaseConhecimentoPage; 