import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Member } from '@/types';

interface MemberAvatarProps {
  member: Member;
  size?: number;
  showPresence?: boolean;
}

export const MemberAvatar = memo(({ member, size = 44, showPresence = false }: MemberAvatarProps) => {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2, backgroundColor: member.avatarBackground }]}
      accessibilityRole="image"
      accessibilityLabel={`${member.name} avatar`}
    >
      <Text style={[styles.emoji, { fontSize: size * 0.6 }]}>{member.emoji}</Text>
      {showPresence && <View style={styles.presenceDot} />}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  emoji: {
    color: '#1C1E26'
  },
  presenceDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#48B27F',
    borderWidth: 2,
    borderColor: '#FFFFFF'
  }
});
