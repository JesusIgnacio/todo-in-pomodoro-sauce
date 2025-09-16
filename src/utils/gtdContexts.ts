import { GTDContext } from '../store/slices/todoSlice';
import { CustomContext } from '../store/slices/customContextSlice';

export interface GTDContextInfo {
  id: GTDContext;
  label: string;
  icon: string;
  color: string;
  description: string;
}

export const GTD_CONTEXTS: GTDContextInfo[] = [
  {
    id: 'inbox',
    label: 'Inbox',
    icon: '📥',
    color: '#6B7280',
    description: 'Unprocessed items to be organized'
  },
  {
    id: 'calls',
    label: '@Calls',
    icon: '📞',
    color: '#10B981',
    description: 'Phone calls to make'
  },
  {
    id: 'computer',
    label: '@Computer',
    icon: '💻',
    color: '#3B82F6',
    description: 'Tasks requiring a computer'
  },
  {
    id: 'errands',
    label: '@Errands',
    icon: '🚗',
    color: '#F59E0B',
    description: 'Tasks to do while out'
  },
  {
    id: 'home',
    label: '@Home',
    icon: '🏠',
    color: '#8B5CF6',
    description: 'Tasks to do at home'
  },
  {
    id: 'office',
    label: '@Office',
    icon: '🏢',
    color: '#EF4444',
    description: 'Tasks to do at the office'
  },
  {
    id: 'waiting-for',
    label: '@Waiting For',
    icon: '⏳',
    color: '#F97316',
    description: 'Waiting for someone else'
  },
  {
    id: 'someday-maybe',
    label: 'Someday/Maybe',
    icon: '💭',
    color: '#6366F1',
    description: 'Future possibilities'
  }
];

export const getContextInfo = (context: GTDContext, customContexts: CustomContext[] = []): GTDContextInfo => {
  // First check built-in contexts
  const builtInContext = GTD_CONTEXTS.find(c => c.id === context);
  if (builtInContext) return builtInContext;
  
  // Then check custom contexts
  const customContext = customContexts.find(c => c.id === context);
  if (customContext) {
    return {
      id: customContext.id,
      label: customContext.label,
      icon: customContext.icon,
      color: customContext.color,
      description: customContext.description,
    };
  }
  
  // Fallback to inbox
  return GTD_CONTEXTS[0];
};

export const getContextColor = (context: GTDContext): string => {
  return getContextInfo(context).color;
};

export const getContextIcon = (context: GTDContext): string => {
  return getContextInfo(context).icon;
};

export const getContextLabel = (context: GTDContext): string => {
  return getContextInfo(context).label;
};

export const getAllContexts = (customContexts: CustomContext[]): GTDContextInfo[] => {
  const customAsGTD: GTDContextInfo[] = customContexts.map(custom => ({
    id: custom.id,
    label: custom.label,
    icon: custom.icon,
    color: custom.color,
    description: custom.description,
  }));
  
  return [...GTD_CONTEXTS, ...customAsGTD];
};

export const isCustomContext = (contextId: string): boolean => {
  return !GTD_CONTEXTS.some(context => context.id === contextId);
};

export const generateContextId = (label: string): string => {
  return label.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
};
