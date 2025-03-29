# Guia de Decisão para Migração de Componentes

Este documento fornece diretrizes para ajudar desenvolvedores a decidir quais componentes devem ser migrados para a biblioteca centralizada `@edunexia/ui-components` e quais devem permanecer como componentes locais em seus respectivos módulos.

## Critérios para Migração para Biblioteca Centralizada

Um componente é um bom candidato para migração quando:

### 1. Reutilização Significativa

✅ **Migrar quando:**
- O componente é usado em mais de um módulo
- O componente pode ser reutilizado em futuros módulos
- Há implementações similares em múltiplos módulos que podem ser consolidadas

❌ **Manter local quando:**
- O componente é específico para um único módulo e sem previsão de uso em outros contextos

### 2. Complexidade e Especificidade

✅ **Migrar quando:**
- O componente é relativamente genérico e pode ser abstraído
- A API é clara e não requer conhecimento específico do contexto de um módulo
- As variações podem ser gerenciadas através de props

❌ **Manter local quando:**
- O componente é fortemente acoplado a lógica específica de negócio de um módulo
- Possui muitas dependências diretas a serviços ou tipos específicos do módulo
- A abstração exigiria uma API muito complexa ou pouco intuitiva

### 3. Estabilidade e Maturidade

✅ **Migrar quando:**
- O componente tem API e funcionalidades estáveis
- As necessidades do componente estão bem compreendidas
- Futuras mudanças serão provavelmente incrementais

❌ **Manter local quando:**
- O componente ainda está em desenvolvimento ativo e sofre mudanças frequentes
- As necessidades futuras são incertas
- A implementação ainda está sendo experimentada ou refinada

### 4. Impacto Visual e Consistência

✅ **Migrar quando:**
- O componente contribui significativamente para a consistência visual
- É uma parte fundamental da identidade visual do produto
- A inconsistência na implementação causaria problemas de UX

❌ **Manter local quando:**
- O componente tem pouco impacto na percepção de consistência visual
- É usado em contextos muito específicos ou raramente visível

## Processo de Decisão

Ao avaliar se um componente deve ser migrado, siga este fluxo de decisão:

1. **Analise o uso atual e futuro**
   - O componente já é usado em mais de um módulo? 
   - Existe potencial para uso em outros módulos no futuro?

2. **Avalie o acoplamento**
   - Quão acoplado está o componente à lógica específica de um módulo?
   - É possível abstrair essas dependências sem complicar demais a API?

3. **Considere o esforço vs. benefício**
   - Quanto esforço seria necessário para migrar e manter uma versão centralizada?
   - Os benefícios de consistência e manutenibilidade superam esse esforço?

4. **Consulte a equipe**
   - Discuta componentes de casos limítrofes com outros desenvolvedores
   - Considere a visão das equipes de design e UX sobre a importância da consistência do componente

## Exemplos Práticos

### Componentes Adequados para Migração

- **Card, Button, Input, Select**: Componentes UI básicos usados em praticamente todos os módulos
- **DashboardLayout**: Estrutura comum que define a experiência de navegação consistente
- **StatsCard**: Componente de visualização de dados com ampla aplicabilidade
- **FormField**: Padrão de formulário usado consistentemente em toda a aplicação

### Componentes que Devem Permanecer Locais

- **DashboardFilter**: Fortemente acoplado a tipos e serviços específicos do módulo matrículas
- **CursoCard**: Implementação específica para exibição de cursos, com lógica e estrutura específicas para um módulo
- **ProcessoSeletivoWizard**: Fluxo complexo específico para um único processo de negócio

## Estratégias de Abstração para Casos Limítrofes

Para componentes que estão na fronteira entre migrar ou manter local:

1. **Abordagem Composicional**
   - Migre os componentes básicos para a biblioteca central
   - Mantenha as composições específicas de cada módulo localmente
   - Exemplo: Um `CardBase` centralizado, mas `CursoCard` específico local

2. **API Extensível**
   - Crie uma API que permita personalização significativa
   - Use padrões como render props ou slot props para máxima flexibilidade
   - Exemplo: `DataGrid` com slots customizáveis para células e cabeçalhos

3. **Desacoplamento de Dados**
   - Separe a apresentação da lógica de busca/manipulação de dados
   - Migre apenas o componente de apresentação, mantendo adaptadores locais
   - Exemplo: `ChartBase` central, com wrappers específicos para cada tipo de dados

## Conclusão

A decisão de migrar um componente deve ser baseada em um equilíbrio entre consistência, reusabilidade e complexidade. Nem todos os componentes são adequados para centralização, e isso é esperado em uma arquitetura saudável.

O objetivo não é centralizar tudo, mas sim identificar os componentes que trarão maior benefício quando compartilhados e padronizados, enquanto mantemos a agilidade e a especificidade onde elas são necessárias. 