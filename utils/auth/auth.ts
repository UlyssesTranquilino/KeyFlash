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
  full_name: string
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

  const name = profile?.full_name;

  const avatar = profile?.avatar_url || 
                 user.user_metadata?.avatar_url || 
                 user.user_metadata?.picture || 
                 null;

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
  createdAt,

};
}
