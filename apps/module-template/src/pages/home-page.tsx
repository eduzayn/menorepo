import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@edunexia/ui-components';
import { useAuth } from '@edunexia/auth';
import { DashboardLayout, PageHeader, Loader } from '@edunexia/ui-components';
import { useListItems } from '../hooks/use-list-items';

/**
 * Hook simulado para substituir a dependência inexistente
 */
const useNavigation = () => {
  return {
    navigateToModule: (module: string) => {
      window.location.href = `/${module}`;
    }
  };
};

/**
 * Página inicial do módulo, exibe a listagem dos itens
 */
export function HomePage() {
  const { user, hasPermission } = useAuth();
  const { navigateToModule } = useNavigation();
  const { items, loading, error } = useListItems();
  
  // Ações para o cabeçalho da página
  const headerActions = (
    <>
      {/* Só exibe o botão de criar para usuários com permissão */}
      {hasPermission('professor') && (
        <Button 
          as={Link} 
          to="criar"
          variant="primary"
        >
          Criar Novo
        </Button>
      )}
    </>
  );
  
  return (
    <DashboardLayout 
      requiredRole="aluno"
      title="Meu Módulo"
    >
      <PageHeader
        title="Meu Módulo"
        subtitle="Gerencie seus itens"
        actions={headerActions}
      />
      
      {/* Exibe loader enquanto carrega */}
      {loading && <Loader text="Carregando itens..." />}
      
      {/* Exibe mensagem de erro se houver */}
      {error && (
        <div className="error-message">
          Erro ao carregar dados: {error}
        </div>
      )}
      
      {/* Lista os itens quando disponíveis */}
      {!loading && !error && items && (
        <div className="items-grid">
          {items.length === 0 ? (
            <div className="empty-state">
              <h3>Nenhum item encontrado</h3>
              <p>Comece criando um novo item.</p>
            </div>
          ) : (
            <div className="items-list">
              {items.map(item => (
                <div key={item.id} className="item-card">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="item-actions">
                    <Button 
                      as={Link}
                      to={`/detalhe/${item.id}`}
                      variant="secondary"
                      size="sm"
                    >
                      Visualizar
                    </Button>
                    
                    {hasPermission('professor') && (
                      <Button 
                        as={Link}
                        to={`/editar/${item.id}`}
                        variant="outline"
                        size="sm"
                      >
                        Editar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
} 