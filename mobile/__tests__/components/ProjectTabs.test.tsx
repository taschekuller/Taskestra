import { fireEvent, render } from '@testing-library/react-native';

import { ProjectTabs } from '@/components/reminders/ProjectTabs';
import type { Project } from '@/types/models';

const projects: Project[] = [
  {
    id: 'p1',
    name: 'İş',
    color: '#000',
    createdAt: new Date('2026-03-10T10:00:00.000Z'),
  },
  {
    id: 'p2',
    name: 'Kişisel',
    color: '#111',
    createdAt: new Date('2026-03-10T10:00:00.000Z'),
  },
];

describe('ProjectTabs', () => {
  it('selects project and all tabs', () => {
    const onSelect = jest.fn();

    const { getByText } = render(
      <ProjectTabs projects={projects} selectedProjectId={undefined} onSelect={onSelect} />,
    );

    fireEvent.press(getByText('İş'));
    expect(onSelect).toHaveBeenCalledWith('p1');

    fireEvent.press(getByText('Tümü'));
    expect(onSelect).toHaveBeenCalledWith(undefined);
  });
});
