import { useEffect } from 'react';
import { demoMembers } from '@/data/sampleEvents';
import { useAuthStore } from '@/state/authStore';

export const useDemoMembers = () => {
  const setMember = useAuthStore((state) => state.setMember);

  useEffect(() => {
    setMember(demoMembers[0]);
  }, [setMember]);

  return demoMembers;
};
