/**
 * Componentes de abas - simples implementação para o Portal de Negociações
 */

import * as React from "react";
import { useState } from "react";

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  children: React.ReactNode;
}

interface TabsContextType {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

const Tabs: React.FC<TabsProps> = ({ 
  defaultValue, 
  children, 
  className = "", 
  ...props 
}) => {
  const [value, setValue] = useState(defaultValue || "");
  
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={`w-full ${className}`} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  forceMount?: boolean;
  children: React.ReactNode;
}

const TabsContent: React.FC<TabsContentProps> = ({ 
  value, 
  children, 
  className = "",
  ...props 
}) => {
  const context = React.useContext(TabsContext);
  
  if (!context) {
    throw new Error("TabsContent deve ser usado dentro de um Tabs");
  }
  
  const isActive = context.value === value;
  
  if (!isActive && !props.forceMount) {
    return null;
  }
  
  return (
    <div 
      role="tabpanel"
      data-state={isActive ? "active" : "inactive"}
      data-value={value}
      className={`${className} ${isActive ? "block" : "hidden"}`}
      {...props}
    >
      {children}
    </div>
  );
};

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const TabsList: React.FC<TabsListProps> = ({ 
  children, 
  className = "", 
  ...props 
}) => {
  return (
    <div 
      role="tablist"
      className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: React.ReactNode;
}

const TabsTrigger: React.FC<TabsTriggerProps> = ({ 
  value, 
  children, 
  className = "", 
  ...props 
}) => {
  const context = React.useContext(TabsContext);
  
  if (!context) {
    throw new Error("TabsTrigger deve ser usado dentro de um Tabs");
  }
  
  const isActive = context.value === value;
  
  return (
    <button
      role="tab"
      type="button"
      data-state={isActive ? "active" : "inactive"}
      data-value={value}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all 
        ${isActive ? "bg-white text-blue-700 shadow-sm" : "text-gray-600 hover:text-gray-800"}
        ${className}`}
      onClick={() => context.setValue(value)}
      {...props}
    >
      {children}
    </button>
  );
};

export { Tabs, TabsContent, TabsList, TabsTrigger }; 