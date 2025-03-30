import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { SiteMenuItem } from '@edunexia/database-schema/src/site-edunexia';
import { 
  useAllMenuItems, 
  useCreateMenuItem, 
  useUpdateMenuItem,
  useDeleteMenuItem,
  useReorderMenuItems 
} from '../../hooks/useMenu';
import { AlertCircle, ChevronUp, ChevronDown, Edit, ExternalLink, Link as LinkIcon, Plus, Trash, Save } from 'lucide-react';

// Tipo estendido para o ID na interface drag and drop
type MenuItemWithDropId = SiteMenuItem & { dropId: string; children?: MenuItemWithDropId[] };

/**
 * Página de gerenciamento de menu do site
 */
export default function MenuPage() {
  const [selectedItem, setSelectedItem] = useState<MenuItemWithDropId | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formValues, setFormValues] = useState<{
    title: string;
    link: string;
    is_active: boolean;
    open_in_new_tab: boolean;
    parent_id: string | null;
  }>({
    title: '',
    link: '',
    is_active: true,
    open_in_new_tab: false,
    parent_id: null,
  });

  // Consultas e mutations
  const menuItemsQuery = useAllMenuItems();
  const createMenuItem = useCreateMenuItem();
  const updateMenuItem = useUpdateMenuItem();
  const deleteMenuItem = useDeleteMenuItem();
  const reorderMenuItems = useReorderMenuItems();

  // Lista plana de itens
  const flatItems = menuItemsQuery.data || [];
  
  // Converter para estrutura de árvore com IDs para drag and drop
  const prepareItemsForDnd = () => {
    const items = [...flatItems];
    const result: MenuItemWithDropId[] = [];
    const lookup: Record<string, MenuItemWithDropId> = {};
    
    // Primeiro criar lookup com todos os itens
    items.forEach(item => {
      lookup[item.id] = { ...item, dropId: `item-${item.id}`, children: [] };
    });
    
    // Depois montar árvore
    items.forEach(item => {
      if (item.parent_id === null) {
        // Item de nível superior
        result.push(lookup[item.id]);
      } else if (lookup[item.parent_id]) {
        // Adicionar como filho
        if (!lookup[item.parent_id].children) {
          lookup[item.parent_id].children = [];
        }
        lookup[item.parent_id].children?.push(lookup[item.id]);
      }
    });
    
    return { tree: result, lookup };
  };

  const { tree: menuTree, lookup: menuLookup } = prepareItemsForDnd();

  // Handlers
  const handleCreateItem = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedItem(null);
    setFormValues({
      title: '',
      link: '',
      is_active: true,
      open_in_new_tab: false,
      parent_id: null,
    });
  };

  const handleEditItem = (item: MenuItemWithDropId) => {
    setSelectedItem(item);
    setIsEditing(true);
    setIsCreating(false);
    setFormValues({
      title: item.title,
      link: item.link,
      is_active: item.is_active,
      open_in_new_tab: item.open_in_new_tab,
      parent_id: item.parent_id,
    });
  };

  const handleDeleteItem = (item: MenuItemWithDropId) => {
    if (window.confirm(`Tem certeza que deseja excluir o item "${item.title}"?`)) {
      deleteMenuItem.mutate(item.id);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : name === 'parent_id' && value === '' 
          ? null 
          : value
    }));
  };

  const handleSaveItem = () => {
    if (!formValues.title || !formValues.link) {
      alert('Título e link são obrigatórios');
      return;
    }

    if (isCreating) {
      // Criar novo item
      createMenuItem.mutate({
        title: formValues.title,
        link: formValues.link,
        is_active: formValues.is_active,
        open_in_new_tab: formValues.open_in_new_tab,
        parent_id: formValues.parent_id,
        order_index: flatItems.length // Adicionar ao final da lista
      });
    } else if (isEditing && selectedItem) {
      // Atualizar item existente
      updateMenuItem.mutate({
        id: selectedItem.id,
        data: {
          title: formValues.title,
          link: formValues.link,
          is_active: formValues.is_active,
          open_in_new_tab: formValues.open_in_new_tab,
          parent_id: formValues.parent_id
        }
      });
    }

    // Resetar formulário
    setIsEditing(false);
    setIsCreating(false);
    setSelectedItem(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setSelectedItem(null);
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Se não tiver destino ou não mudar de posição, não faz nada
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Obter o item arrastado e seu parent ID atual
    const itemId = draggableId.replace('item-', '');
    const sourceItem = menuLookup[itemId];
    
    if (!sourceItem) return;
    
    // É uma reordenação simples dentro do mesmo nível
    if (destination.droppableId === source.droppableId) {
      // Obter lista de IDs correspondente ao droppableId
      let affectedItems: MenuItemWithDropId[] = [];
      
      if (destination.droppableId === 'root') {
        // Items de nível superior
        affectedItems = menuTree;
      } else {
        // Items filhos de algum pai
        const parentId = destination.droppableId.replace('children-', '');
        const parent = menuLookup[parentId];
        if (parent && parent.children) {
          affectedItems = parent.children;
        }
      }
      
      // Reordenar os itens
      const itemsCopy = [...affectedItems];
      const [movedItem] = itemsCopy.splice(source.index, 1);
      itemsCopy.splice(destination.index, 0, movedItem);
      
      // Atualizar ordem no banco de dados
      const itemIds = itemsCopy.map(item => item.id);
      reorderMenuItems.mutate(itemIds);
    } else {
      // Mudou de pai (mais complexo)
      // Primeiro, remover de onde estava
      const oldParentId = source.droppableId === 'root' 
        ? null 
        : source.droppableId.replace('children-', '');
      
      // Depois, adicionar ao novo pai
      const newParentId = destination.droppableId === 'root' 
        ? null 
        : destination.droppableId.replace('children-', '');
      
      // Atualizar o parentId no banco de dados
      updateMenuItem.mutate({
        id: sourceItem.id,
        data: {
          parent_id: newParentId
        }
      });
    }
  };

  // Renderizar um item do menu com indentação e controles
  const renderMenuItem = (item: MenuItemWithDropId, index: number, level = 0, droppableId = 'root') => {
    const hasChildren = item.children && item.children.length > 0;
    
    return (
      <Draggable key={item.dropId} draggableId={item.dropId} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="border border-gray-200 rounded-md mb-2 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`inline-block w-2 h-2 rounded-full ${item.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="font-medium">{item.title}</span>
                {!item.is_active && (
                  <span className="text-xs text-red-500 flex items-center">
                    <AlertCircle size={12} className="mr-1" /> Inativo
                  </span>
                )}
                {item.open_in_new_tab && (
                  <ExternalLink size={14} className="text-gray-500" />
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 mr-2">{item.link}</span>
                <button
                  onClick={() => handleEditItem(item)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                  title="Editar"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteItem(item)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                  title="Excluir"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
            
            {/* Renderizar filhos (submenu) */}
            {hasChildren && (
              <Droppable droppableId={`children-${item.id}`} type="menuItem">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="ml-8 pl-4 border-l-2 border-gray-100 mt-1 mb-2"
                  >
                    {item.children?.map((childItem, childIndex) => 
                      renderMenuItem(childItem, childIndex, level + 1, `children-${item.id}`)
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            )}
          </div>
        )}
      </Draggable>
    );
  };

  // Renderizar formulário de edição/criação
  const renderForm = () => {
    return (
      <div className="bg-white p-4 mb-6 rounded-md shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium mb-4">
          {isCreating ? "Adicionar novo item de menu" : "Editar item de menu"}
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título*
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formValues.title}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Sobre Nós"
              required
            />
          </div>
          
          <div>
            <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">
              Link*
            </label>
            <div className="flex items-center">
              <LinkIcon size={16} className="text-gray-400 mr-2" />
              <input
                id="link"
                name="link"
                type="text"
                value={formValues.link}
                onChange={handleFormChange}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ex: /sobre ou https://exemplo.com"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="parent_id" className="block text-sm font-medium text-gray-700 mb-1">
              Item pai (opcional)
            </label>
            <select
              id="parent_id"
              name="parent_id"
              value={formValues.parent_id || ''}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Nenhum (item de nível superior)</option>
              {flatItems
                .filter(item => 
                  item.parent_id === null && 
                  (!selectedItem || item.id !== selectedItem.id)
                )
                .map(item => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))
              }
            </select>
          </div>
          
          <div className="flex space-x-6">
            <div className="flex items-center">
              <input
                id="is_active"
                name="is_active"
                type="checkbox"
                checked={formValues.is_active}
                onChange={handleFormChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                Ativo
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                id="open_in_new_tab"
                name="open_in_new_tab"
                type="checkbox"
                checked={formValues.open_in_new_tab}
                onChange={handleFormChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="open_in_new_tab" className="ml-2 block text-sm text-gray-700">
                Abrir em nova aba
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSaveItem}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Save size={18} className="mr-1" /> Salvar
            </button>
          </div>
        </div>
      </div>
    );
  };

  const isWorking = 
    createMenuItem.isLoading || 
    updateMenuItem.isLoading || 
    deleteMenuItem.isLoading ||
    reorderMenuItems.isLoading;

  if (menuItemsQuery.isLoading) {
    return (
      <div className="p-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-40 bg-gray-200 rounded mb-6"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Menu</h1>
        <button
          onClick={handleCreateItem}
          disabled={isWorking}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <Plus size={18} className="mr-1" /> Adicionar Item
        </button>
      </div>
      
      {(isCreating || isEditing) && renderForm()}
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="root" type="menuItem">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-2"
            >
              {menuTree.map((item, index) => renderMenuItem(item, index))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      {menuTree.length === 0 && !isCreating && (
        <div className="text-center py-12 bg-gray-50 rounded-md border border-gray-200">
          <p className="text-gray-500">Nenhum item de menu cadastrado.</p>
          <button
            onClick={handleCreateItem}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Adicionar o primeiro item
          </button>
        </div>
      )}
    </div>
  );
} 