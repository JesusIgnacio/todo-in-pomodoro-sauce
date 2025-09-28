import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserPlan {
  type: 'free' | 'pro';
  name: string;
  features: string[];
}

export interface UserContextType {
  isPro: boolean;
  userPlan: UserPlan;
  upgradeToPro: () => void;
  downgradToFree: () => void;
}

const USER_PLANS: Record<'free' | 'pro', UserPlan> = {
  free: {
    type: 'free',
    name: 'Free Plan',
    features: [
      'Basic todo management',
      'Pomodoro timer',
      '8 built-in GTD contexts',
      'Dark/light theme',
      'Keyboard shortcuts'
    ]
  },
  pro: {
    type: 'pro',
    name: 'Pro Plan',
    features: [
      'Everything in Free',
      'Custom GTD contexts',
      'Advanced context management',
      'Context color customization',
      'Priority support'
    ]
  }
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userPlan, setUserPlan] = useState<UserPlan>(USER_PLANS.free);

  // Load user plan from localStorage on mount
  useEffect(() => {
    const savedPlan = localStorage.getItem('userPlan');
    if (savedPlan) {
      try {
        const planType = JSON.parse(savedPlan) as 'free' | 'pro';
        setUserPlan(USER_PLANS[planType] || USER_PLANS.free);
      } catch (error) {
        console.error('Failed to load user plan:', error);
      }
    }
  }, []);

  // Save user plan to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userPlan', JSON.stringify(userPlan.type));
  }, [userPlan]);

  const upgradeToPro = () => {
    setUserPlan(USER_PLANS.pro);
  };

  const downgradToFree = () => {
    setUserPlan(USER_PLANS.free);
  };

  const value: UserContextType = {
    isPro: userPlan.type === 'pro',
    userPlan,
    upgradeToPro,
    downgradToFree
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
