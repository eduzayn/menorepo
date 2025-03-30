import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as coursesModule from '../courses';
import * as supabaseModule from '../supabase';

// Criamos uma instância da classe
const CourseService = coursesModule.default || class CourseService {};

// Mock do Supabase
vi.mock('../supabase', () => ({
  useDatabase: vi.fn(),
  default: {
    getClient: vi.fn(),
    getCurrentUser: vi.fn(),
    hasPermission: vi.fn()
  }
}));

describe('CourseService', () => {
  let courseService: InstanceType<typeof CourseService>;
  const mockSupabaseClient = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    single: vi.fn()
  };

  const mockUser = { id: 'user-123', email: 'teste@edunexia.com.br' };
  
  const mockCourse = {
    id: 'curso-123',
    nome: 'Curso Teste',
    descricao: 'Descrição do curso de teste',
    coordenador_id: mockUser.id,
    status: 'rascunho',
    criado_em: '2025-03-30T00:00:00Z',
    atualizado_em: '2025-03-30T00:00:00Z'
  };

  beforeEach(() => {
    // Configura o mock do cliente Supabase
    vi.mocked(supabaseModule.default.getClient).mockReturnValue(mockSupabaseClient as any);
    
    // Configura mock do usuário atual
    vi.mocked(supabaseModule.default.getCurrentUser).mockResolvedValue(mockUser as any);
    
    // Configura mock da verificação de permissão (permitindo por padrão)
    vi.mocked(supabaseModule.default.hasPermission).mockResolvedValue(true);
    
    // Configura a data atual para ser determinística
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-03-30T00:00:00Z'));
    
    // Instancia o serviço
    courseService = new CourseService();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.useRealTimers();
  });

  describe('createCourse', () => {
    it('deve criar um novo curso com sucesso', async () => {
      // Configura o retorno do insert
      mockSupabaseClient.single.mockResolvedValueOnce({ data: mockCourse, error: null });
      
      const newCourse = {
        nome: 'Curso Teste',
        descricao: 'Descrição do curso de teste'
      };
      
      const result = await courseService.createCourse(newCourse);
      
      // Verifica se o getClient foi chamado
      expect(supabaseModule.default.getClient).toHaveBeenCalled();
      
      // Verifica se verificou permissão
      expect(supabaseModule.default.hasPermission).toHaveBeenCalledWith('create', 'cursos');
      
      // Verifica se o from foi chamado com a tabela correta
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('cursos');
      
      // Verifica se o insert foi chamado com os dados corretos
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith(expect.objectContaining({
        nome: 'Curso Teste',
        descricao: 'Descrição do curso de teste',
        coordenador_id: mockUser.id,
        status: 'rascunho'
      }));
      
      // Verifica se retornou o curso corretamente
      expect(result).toEqual(mockCourse);
    });
    
    it('deve retornar null quando não tem permissão para criar cursos', async () => {
      // Mock da verificação de permissão negando acesso
      vi.mocked(supabaseModule.default.hasPermission).mockResolvedValueOnce(false);
      
      const newCourse = {
        nome: 'Curso Teste',
        descricao: 'Descrição do curso de teste'
      };
      
      const result = await courseService.createCourse(newCourse);
      
      // Verifica se verificou permissão
      expect(supabaseModule.default.hasPermission).toHaveBeenCalledWith('create', 'cursos');
      
      // Verifica se o insert não foi chamado
      expect(mockSupabaseClient.insert).not.toHaveBeenCalled();
      
      // Verifica se retornou null
      expect(result).toBeNull();
    });
    
    it('deve retornar null quando ocorre um erro no insert', async () => {
      // Configura o retorno do insert com erro
      mockSupabaseClient.single.mockResolvedValueOnce({ 
        data: null, 
        error: { message: 'Erro ao inserir curso' } 
      });
      
      const newCourse = {
        nome: 'Curso Teste',
        descricao: 'Descrição do curso de teste'
      };
      
      const result = await courseService.createCourse(newCourse);
      
      // Verifica se o insert foi chamado
      expect(mockSupabaseClient.insert).toHaveBeenCalled();
      
      // Verifica se retornou null
      expect(result).toBeNull();
    });
  });
  
  describe('getCourseById', () => {
    it('deve buscar um curso pelo ID com sucesso', async () => {
      // Configura o retorno do select
      mockSupabaseClient.single.mockResolvedValueOnce({ data: mockCourse, error: null });
      
      const result = await courseService.getCourseById('curso-123');
      
      // Verifica se o from foi chamado com a view correta
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('cursos_completos');
      
      // Verifica se o eq foi chamado com o ID correto
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', 'curso-123');
      
      // Verifica se retornou o curso corretamente
      expect(result).toEqual(mockCourse);
    });
    
    it('deve retornar null quando o curso não existe', async () => {
      // Configura o retorno do select com erro
      mockSupabaseClient.single.mockResolvedValueOnce({ 
        data: null, 
        error: { message: 'Curso não encontrado' } 
      });
      
      const result = await courseService.getCourseById('curso-inexistente');
      
      // Verifica se o eq foi chamado com o ID correto
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', 'curso-inexistente');
      
      // Verifica se retornou null
      expect(result).toBeNull();
    });
  });
  
  describe('updateCourse', () => {
    it('deve atualizar um curso com sucesso', async () => {
      // Configura o retorno do update
      mockSupabaseClient.single.mockResolvedValueOnce({ 
        data: { ...mockCourse, nome: 'Curso Atualizado' }, 
        error: null 
      });
      
      const updates = {
        nome: 'Curso Atualizado'
      };
      
      const result = await courseService.updateCourse('curso-123', updates);
      
      // Verifica se verificou permissão
      expect(supabaseModule.default.hasPermission).toHaveBeenCalledWith('update', 'cursos');
      
      // Verifica se o from foi chamado com a tabela correta
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('cursos');
      
      // Verifica se o update foi chamado com os dados corretos
      expect(mockSupabaseClient.update).toHaveBeenCalledWith(expect.objectContaining({
        nome: 'Curso Atualizado',
        atualizado_em: expect.any(String)
      }));
      
      // Verifica se o eq foi chamado com o ID correto
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', 'curso-123');
      
      // Verifica se retornou o curso atualizado
      expect(result).toEqual(expect.objectContaining({
        id: 'curso-123',
        nome: 'Curso Atualizado'
      }));
    });
    
    it('deve retornar null quando não tem permissão para atualizar cursos', async () => {
      // Mock da verificação de permissão negando acesso
      vi.mocked(supabaseModule.default.hasPermission).mockResolvedValueOnce(false);
      
      const updates = {
        nome: 'Curso Atualizado'
      };
      
      const result = await courseService.updateCourse('curso-123', updates);
      
      // Verifica se verificou permissão
      expect(supabaseModule.default.hasPermission).toHaveBeenCalledWith('update', 'cursos');
      
      // Verifica se o update não foi chamado
      expect(mockSupabaseClient.update).not.toHaveBeenCalled();
      
      // Verifica se retornou null
      expect(result).toBeNull();
    });
  });
  
  describe('changeCourseStatus', () => {
    it('deve alterar o status de um curso com sucesso', async () => {
      // Configura o retorno do update
      mockSupabaseClient.eq.mockResolvedValueOnce({ error: null });
      
      const result = await courseService.changeCourseStatus('curso-123', 'ativo');
      
      // Verifica se verificou permissão
      expect(supabaseModule.default.hasPermission).toHaveBeenCalledWith('update', 'cursos');
      
      // Verifica se o from foi chamado com a tabela correta
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('cursos');
      
      // Verifica se o update foi chamado com os dados corretos
      expect(mockSupabaseClient.update).toHaveBeenCalledWith(expect.objectContaining({
        status: 'ativo',
        atualizado_em: expect.any(String)
      }));
      
      // Verifica se o eq foi chamado com o ID correto
      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('id', 'curso-123');
      
      // Verifica se retornou true
      expect(result).toBe(true);
    });
    
    it('deve retornar false quando há um erro ao alterar o status', async () => {
      // Configura o retorno do update com erro
      mockSupabaseClient.eq.mockResolvedValueOnce({ 
        error: { message: 'Erro ao atualizar status' } 
      });
      
      const result = await courseService.changeCourseStatus('curso-123', 'ativo');
      
      // Verifica se retornou false
      expect(result).toBe(false);
    });
  });
}); 