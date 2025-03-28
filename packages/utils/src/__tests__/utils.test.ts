import { describe, it, expect, vi } from 'vitest';
import {
  cn,
  formatDate,
  formatNumber,
  formatPercentage,
  formatDuration,
  formatFileSize,
  truncateText,
  generateId,
  isValidUrl,
  isValidEmail,
  isValidPassword,
  isValidCPF,
  formatCPF,
  formatPhone,
  formatCEP,
  formatCurrency,
  formatRelativeDate
} from '../utils';

describe('Utilidades', () => {
  describe('cn - Combinação de classes', () => {
    it('deve combinar classes corretamente', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
      expect(cn('class1', { class2: true, class3: false })).toBe('class1 class2');
      expect(cn('p-4', 'mt-2', 'bg-blue-500')).toBe('p-4 mt-2 bg-blue-500');
    });

    it('deve resolver conflitos de classes do Tailwind', () => {
      expect(cn('p-2', 'p-4')).toBe('p-4');
      expect(cn('mt-2', 'mt-4')).toBe('mt-4');
      expect(cn('text-blue-500', 'text-red-500')).toBe('text-red-500');
    });
  });

  describe('formatDate', () => {
    it('deve formatar a data no padrão pt-BR', () => {
      const date = new Date(2023, 0, 15, 10, 30); // 15/01/2023 10:30
      expect(formatDate(date)).toContain('15/01/2023');
    });
  });

  describe('formatNumber', () => {
    it('deve formatar números com separadores brasileiros', () => {
      expect(formatNumber(1000)).toBe('1.000');
      expect(formatNumber(1000000)).toBe('1.000.000');
      expect(formatNumber(1234.56)).toBe('1.234,56');
    });
  });

  describe('formatPercentage', () => {
    it('deve formatar números como porcentagem', () => {
      expect(formatPercentage(10)).toBe('10,0%');
      expect(formatPercentage(25.5)).toBe('25,5%');
      expect(formatPercentage(100)).toBe('100,0%');
    });
  });

  describe('formatDuration', () => {
    it('deve formatar duração em minutos', () => {
      expect(formatDuration(30)).toBe('30 min');
      expect(formatDuration(60)).toBe('1h 0min');
      expect(formatDuration(90)).toBe('1h 30min');
      expect(formatDuration(145)).toBe('2h 25min');
    });
  });

  describe('formatFileSize', () => {
    it('deve formatar tamanhos de arquivo em unidades apropriadas', () => {
      expect(formatFileSize(500)).toBe('500.0 B');
      expect(formatFileSize(1024)).toBe('1.0 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1.0 GB');
      expect(formatFileSize(1024 * 1024 * 1024 * 1024)).toBe('1.0 TB');
    });
  });

  describe('truncateText', () => {
    it('deve truncar texto excedendo o comprimento máximo', () => {
      expect(truncateText('Texto curto', 20)).toBe('Texto curto');
      expect(truncateText('Este é um texto muito longo que deve ser truncado', 20)).toBe('Este é um texto muito...');
    });
  });

  describe('generateId', () => {
    it('deve gerar IDs únicos', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('isValidUrl', () => {
    it('deve validar URLs corretamente', () => {
      expect(isValidUrl('https://www.edunexia.com.br')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
      expect(isValidUrl('não é uma url')).toBe(false);
      expect(isValidUrl('www.exemplo.com')).toBe(false); // Falta protocolo
    });
  });

  describe('isValidEmail', () => {
    it('deve validar emails corretamente', () => {
      expect(isValidEmail('usuario@edunexia.com.br')).toBe(true);
      expect(isValidEmail('nome.sobrenome@exemplo.com')).toBe(true);
      expect(isValidEmail('email@sub.dominio.com')).toBe(true);
      expect(isValidEmail('inválido')).toBe(false);
      expect(isValidEmail('usuario@')).toBe(false);
      expect(isValidEmail('@dominio.com')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('deve validar senhas corretamente', () => {
      expect(isValidPassword('Abc12345')).toBe(true);
      expect(isValidPassword('Senha123')).toBe(true);
      expect(isValidPassword('abc123')).toBe(false); // Sem letra maiúscula
      expect(isValidPassword('ABCDEF')).toBe(false); // Sem número
      expect(isValidPassword('Ab1')).toBe(false); // Menos de 8 caracteres
    });
  });

  describe('isValidCPF', () => {
    it('deve validar CPFs corretamente', () => {
      expect(isValidCPF('529.982.247-25')).toBe(true);
      expect(isValidCPF('52998224725')).toBe(true);
      expect(isValidCPF('111.111.111-11')).toBe(false); // CPF inválido (dígitos repetidos)
      expect(isValidCPF('123.456.789-10')).toBe(false); // CPF inválido
      expect(isValidCPF('123456')).toBe(false); // Comprimento errado
    });
  });

  describe('formatCPF', () => {
    it('deve formatar CPFs corretamente', () => {
      expect(formatCPF('52998224725')).toBe('529.982.247-25');
      expect(formatCPF('529.982.247-25')).toBe('529.982.247-25');
    });
  });

  describe('formatPhone', () => {
    it('deve formatar telefones corretamente', () => {
      expect(formatPhone('11987654321')).toBe('(11) 98765-4321');
      expect(formatPhone('(11) 98765-4321')).toBe('(11) 98765-4321');
    });
  });

  describe('formatCEP', () => {
    it('deve formatar CEPs corretamente', () => {
      expect(formatCEP('12345678')).toBe('12345-678');
      expect(formatCEP('12345-678')).toBe('12345-678');
    });
  });

  describe('formatCurrency', () => {
    it('deve formatar valores monetários corretamente', () => {
      expect(formatCurrency(100)).toBe('R$ 100,00');
      expect(formatCurrency(1234.56)).toBe('R$ 1.234,56');
      expect(formatCurrency(0)).toBe('R$ 0,00');
    });
  });

  describe('formatRelativeDate', () => {
    it('deve formatar datas relativas corretamente', () => {
      const now = new Date();
      
      // Agora mesmo
      expect(formatRelativeDate(now)).toBe('agora mesmo');
      
      // Minutos atrás
      const minutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      expect(formatRelativeDate(minutesAgo)).toBe('5 minutos atrás');
      
      // Uma hora atrás
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      expect(formatRelativeDate(oneHourAgo)).toBe('1 hora atrás');
      
      // Horas atrás
      const hoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
      expect(formatRelativeDate(hoursAgo)).toBe('3 horas atrás');
      
      // Um dia atrás - mock para evitar questões de fuso horário nos testes
      vi.spyOn(Date.prototype, 'getTime').mockImplementationOnce(() => now.getTime() + 24 * 60 * 60 * 1000);
      const oneDayAgo = new Date(now.getTime());
      expect(formatRelativeDate(oneDayAgo)).toBe('1 dia atrás');
      
      // Dias atrás - mock para evitar questões de fuso horário nos testes
      vi.spyOn(Date.prototype, 'getTime').mockImplementationOnce(() => now.getTime() + 3 * 24 * 60 * 60 * 1000);
      const daysAgo = new Date(now.getTime());
      expect(formatRelativeDate(daysAgo)).toBe('3 dias atrás');
    });
  });
}); 