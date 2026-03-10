import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/components/ui/GlassCard';
import { Colors } from '@/constants/Colors';

interface BentoBoardProps {
  noteCount: number;
  folderCount: number;
  latestNoteTitle?: string;
  onCreateNote: () => void;
  onOpenFolders: () => void;
}

export const BentoBoard = ({
  noteCount,
  folderCount,
  latestNoteTitle,
  onCreateNote,
  onOpenFolders,
}: BentoBoardProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable style={styles.heroWrap} onPress={onCreateNote}>
          <GlassCard style={styles.heroCard} contentStyle={[styles.heroContent, styles.yellowSurface]}>
            <Text style={styles.heroEyebrow}>Quick Note</Text>
            <Text style={styles.heroTitle}>Capture ideas instantly</Text>
            <View style={styles.heroFooter}>
              <Text style={styles.heroMeta}>{noteCount} not hazır</Text>
              <View style={styles.heroIconBubble}>
                <Ionicons name="add" size={18} color={Colors.noteAccentText} />
              </View>
            </View>
          </GlassCard>
        </Pressable>

        <View style={styles.sideColumn}>
          <Pressable onPress={onOpenFolders}>
            <GlassCard contentStyle={styles.statCardContent}>
              <Text style={styles.statLabel}>Folders</Text>
              <Text style={styles.statValue}>{folderCount}</Text>
            </GlassCard>
          </Pressable>

          <GlassCard contentStyle={styles.statCardContent}>
            <Text style={styles.statLabel}>Pinned</Text>
            <Text style={styles.statValue}>{Math.min(noteCount, 3)}</Text>
          </GlassCard>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <GlassCard style={styles.bottomCard}>
          <Text style={styles.bottomLabel}>Latest</Text>
          <Text numberOfLines={2} style={styles.bottomTitle}>
            {latestNoteTitle || 'Henüz başlık yok, ilk notunu ekle.'}
          </Text>
        </GlassCard>

        <GlassCard style={styles.bottomCard} contentStyle={styles.toolsCardContent}>
          <Text style={styles.bottomLabel}>Tools</Text>
          <View style={styles.toolsRow}>
            <View style={styles.toolPill}>
              <Ionicons name="mic-outline" size={14} color={Colors.glassText} />
              <Text style={styles.toolPillText}>Voice</Text>
            </View>
            <View style={styles.toolPill}>
              <Ionicons name="star-outline" size={14} color={Colors.glassText} />
              <Text style={styles.toolPillText}>Pin</Text>
            </View>
          </View>
        </GlassCard>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'stretch',
  },
  heroWrap: {
    flex: 1.4,
  },
  heroCard: {
    height: 168,
    borderColor: Colors.noteAccentStrong,
  },
  heroContent: {
    flex: 1,
  },
  yellowSurface: {
    backgroundColor: Colors.noteAccentSoft,
  },
  heroEyebrow: {
    color: Colors.noteAccentText,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: Colors.noteAccentText,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 8,
    lineHeight: 28,
  },
  heroFooter: {
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroMeta: {
    color: Colors.noteAccentText,
    fontWeight: '600',
  },
  heroIconBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(43,36,18,0.2)',
  },
  sideColumn: {
    flex: 1,
    gap: 10,
  },
  statCardContent: {
    minHeight: 79,
    justifyContent: 'space-between',
  },
  statLabel: {
    color: Colors.glassSubtext,
    fontSize: 12,
    fontWeight: '600',
  },
  statValue: {
    color: Colors.glassText,
    fontSize: 24,
    fontWeight: '800',
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 10,
  },
  bottomCard: {
    flex: 1,
  },
  bottomLabel: {
    color: Colors.glassSubtext,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  bottomTitle: {
    marginTop: 8,
    color: Colors.glassText,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  toolsCardContent: {
    minHeight: 94,
  },
  toolsRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  toolPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  toolPillText: {
    color: Colors.glassText,
    fontSize: 12,
    fontWeight: '600',
  },
});
