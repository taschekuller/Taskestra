export type Priority = 'low' | 'medium' | 'high';
export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Project {
  id: string;
  name: string;
  color: string;
  googleCalendarId?: string;
  createdAt: Date;
}

export interface ProjectRecord {
  id: string;
  name: string;
  color: string;
  googleCalendarId?: string;
  createdAtIso: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId?: string;
  dueDate: Date;
  isCompleted: boolean;
  priority: Priority;
  createdAt: Date;
}

export interface TaskRecord {
  id: string;
  title: string;
  description?: string;
  projectId?: string;
  dueDateIso: string;
  isCompleted: boolean;
  priority: Priority;
  createdAtIso: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  googleCalendarId: string;
  projectId?: string;
  color?: string;
}

export interface CalendarEventRecord {
  id: string;
  title: string;
  startDateIso: string;
  endDateIso: string;
  googleCalendarId: string;
  projectId?: string;
  color?: string;
}

export interface Reminder {
  id: string;
  title: string;
  notes?: string;
  projectId?: string;
  dueDate: Date;
  repeatType: RepeatType;
  isCompleted: boolean;
  notificationId?: string;
  createdAt: Date;
}

export interface ReminderRecord {
  id: string;
  title: string;
  notes?: string;
  projectId?: string;
  dueDateIso: string;
  repeatType: RepeatType;
  isCompleted: boolean;
  notificationId?: string;
  createdAtIso: string;
}

export interface NoteFolder {
  id: string;
  name: string;
  color: string;
  emoji?: string;
  noteCount: number;
  createdAt: Date;
}

export interface NoteFolderRecord {
  id: string;
  name: string;
  color: string;
  emoji?: string;
  createdAtIso: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  folderId?: string;
  projectId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteRecord {
  id: string;
  title: string;
  content: string;
  folderId?: string;
  projectId?: string;
  createdAtIso: string;
  updatedAtIso: string;
}

export interface CalendarLink {
  googleCalendarId: string;
  projectId: string;
  color?: string;
}

export const toProject = (project: ProjectRecord): Project => ({
  id: project.id,
  name: project.name,
  color: project.color,
  googleCalendarId: project.googleCalendarId,
  createdAt: new Date(project.createdAtIso),
});

export const toTask = (task: TaskRecord): Task => ({
  id: task.id,
  title: task.title,
  description: task.description,
  projectId: task.projectId,
  dueDate: new Date(task.dueDateIso),
  isCompleted: task.isCompleted,
  priority: task.priority,
  createdAt: new Date(task.createdAtIso),
});

export const toCalendarEvent = (event: CalendarEventRecord): CalendarEvent => ({
  id: event.id,
  title: event.title,
  startDate: new Date(event.startDateIso),
  endDate: new Date(event.endDateIso),
  googleCalendarId: event.googleCalendarId,
  projectId: event.projectId,
  color: event.color,
});

export const toReminder = (reminder: ReminderRecord): Reminder => ({
  id: reminder.id,
  title: reminder.title,
  notes: reminder.notes,
  projectId: reminder.projectId,
  dueDate: new Date(reminder.dueDateIso),
  repeatType: reminder.repeatType,
  isCompleted: reminder.isCompleted,
  notificationId: reminder.notificationId,
  createdAt: new Date(reminder.createdAtIso),
});

export const toNote = (note: NoteRecord): Note => ({
  id: note.id,
  title: note.title,
  content: note.content,
  folderId: note.folderId,
  projectId: note.projectId,
  createdAt: new Date(note.createdAtIso),
  updatedAt: new Date(note.updatedAtIso),
});

export const toFolder = (folder: NoteFolderRecord, noteCount: number): NoteFolder => ({
  id: folder.id,
  name: folder.name,
  color: folder.color,
  emoji: folder.emoji,
  noteCount,
  createdAt: new Date(folder.createdAtIso),
});
