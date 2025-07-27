interface AuthUser {
  id: string;
  email?: string | null;
  user_metadata?: {
    name?: string;
    avatar_url?: string;
    picture?: string;
  };
  created_at?: string;
}

interface ProfileUser {
  nickname?: string;
  avatar_url?: string;
  is_pro?: boolean;
  created_at?: string;
}

interface TransformedUser {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  isPro: boolean;
  createdAt: Date;
}

export function transformUser(user: AuthUser | null, profile?: ProfileUser | null): TransformedUser | null {
  if (!user) return null;



  // Fallback name resolution
  const name = profile?.nickname || 
               user.user_metadata?.name || 
               (user.email ? user.email.split('@')[0] : 'User');

  // Avatar resolution with null if no avatar exists
  const avatar = profile?.avatar_url || 
                 user.user_metadata?.avatar_url || 
                 user.user_metadata?.picture || 
                 null;

  // Date handling
  const createdAt = new Date(
    profile?.created_at || 
    user.created_at || 
    new Date().toISOString()
  );

  return {
    id: user.id,
    email: user.email || '',
    name,
    avatar,
    isPro: profile?.is_pro || false,
    createdAt
  };
}