import { ScrollView, StyleSheet } from 'react-native';

import { Layout } from '@/constants/Layout';
import { Chip } from '@/components/ui/Chip';
import type { Project } from '@/types/models';

interface ProjectTabsProps {
  projects: Project[];
  selectedProjectId?: string;
  onSelect: (projectId?: string) => void;
}

export const ProjectTabs = ({ projects, selectedProjectId, onSelect }: ProjectTabsProps) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      <Chip label="Tümü" selected={!selectedProjectId} onPress={() => onSelect(undefined)} />

      {projects.map((project) => (
        <Chip
          key={project.id}
          label={project.name}
          selected={selectedProjectId === project.id}
          onPress={() => onSelect(project.id)}
          accentColor={project.color}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Layout.spacing.xs,
    paddingBottom: Layout.spacing.xs,
  },
});
