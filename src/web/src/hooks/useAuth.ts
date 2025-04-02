import { useStytch, useStytchUser } from '@stytch/react';
import { useMemo } from 'react';
import type { Roles } from '../authentication';

export const useAuth = () => {
  const { session } = useStytch();
  const { user: stytchUser } = useStytchUser();

  const user = useMemo(() => {
    if (!stytchUser) {
      return null;
    }

    return {
      id: stytchUser.user_id,
      name: `${stytchUser.name.first_name} ${stytchUser.name.last_name}`,
      role: stytchUser.trusted_metadata?.role as Roles,
    };
  }, [stytchUser]);

  return { user, session };
};
