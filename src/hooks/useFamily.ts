import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { familyRepository } from '@/repositories/familyRepository';
import { memberRepository } from '@/repositories/memberRepository';
import { useAuthStore } from '@/state/authStore';

export const familyKeys = {
  all: ['family'] as const,
  current: () => [...familyKeys.all, 'current'] as const,
  detail: (id: string) => [...familyKeys.all, id] as const,
  members: (familyId: string) =>
    [...familyKeys.all, familyId, 'members'] as const,
};

export function useCurrentFamily() {
  return useQuery({
    queryKey: familyKeys.current(),
    queryFn: () => familyRepository.fetchCurrentUserFamily(),
    staleTime: 5 * 60_000,
  });
}

export function useFamily(familyId: string | undefined) {
  return useQuery({
    queryKey: familyKeys.detail(familyId ?? ''),
    queryFn: () => familyRepository.fetchFamilyById(familyId!),
    enabled: Boolean(familyId),
    staleTime: 5 * 60_000,
  });
}

export function useFamilyMembers(familyId: string | undefined) {
  return useQuery({
    queryKey: familyKeys.members(familyId ?? ''),
    queryFn: () => memberRepository.fetchMembersByFamily(familyId!),
    enabled: Boolean(familyId),
    staleTime: 60_000,
  });
}

export function useCurrentMember() {
  const setMember = useAuthStore((state) => state.setMember);

  return useQuery({
    queryKey: ['member', 'current'],
    queryFn: async () => {
      const member = await memberRepository.fetchCurrentMember();
      if (member) {
        setMember(member);
      }
      return member;
    },
    staleTime: 5 * 60_000,
  });
}

export function useCreateFamily() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, timezone }: { name: string; timezone?: string }) =>
      familyRepository.createFamily(name, timezone),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: familyKeys.current() });
    },
  });
}

export function useUpdateFamily() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      familyId,
      updates,
    }: {
      familyId: string;
      updates: { name?: string; timezone?: string };
    }) => familyRepository.updateFamily(familyId, updates),
    onSuccess: (_, { familyId }) => {
      queryClient.invalidateQueries({ queryKey: familyKeys.detail(familyId) });
      queryClient.invalidateQueries({ queryKey: familyKeys.current() });
    },
  });
}
