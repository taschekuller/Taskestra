export type Priority = 'low' | 'medium' | 'high';
export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly';
export type ReminderListKey = 'work' | 'personal' | 'school' | 'learning' | 'others';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  isCompleted: boolean;
  priority: Priority;
  createdAt: Date;
}

export interface TaskRecord {
  id: string;
  title: string;
  description?: string;
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
  color?: string;
}

export interface CalendarEventRecord {
  id: string;
  title: string;
  startDateIso: string;
  endDateIso: string;
  googleCalendarId: string;
  color?: string;
}

export interface Reminder {
  id: string;
  title: string;
  notes?: string;
  dueDate: Date;
  listKey: ReminderListKey;
  repeatType: RepeatType;
  isCompleted: boolean;
  notificationId?: string;
  createdAt: Date;
}

export interface ReminderRecord {
  id: string;
  title: string;
  notes?: string;
  dueDateIso: string;
  listKey?: ReminderListKey | 'sport' | 'university';
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
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteRecord {
  id: string;
  title: string;
  content: string;
  folderId?: string;
  createdAtIso: string;
  updatedAtIso: string;
}

const mapReminderListKey = (listKey?: ReminderRecord['listKey']): ReminderListKey => {
  if (listKey === 'work' || listKey === 'personal' || listKey === 'school' || listKey === 'learning' || listKey === 'others') {
    return listKey;
  }

  if (listKey === 'university') {
    return 'school';
  }

  if (listKey === 'sport') {
    return 'learning';
  }

  return 'others';
};

export const toTask = (task: TaskRecord): Task => ({
  id: task.id,
  title: task.title,
  description: task.description,
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
  color: event.color,
});

export const toReminder = (reminder: ReminderRecord): Reminder => ({
  id: reminder.id,
  title: reminder.title,
  notes: reminder.notes,
  dueDate: new Date(reminder.dueDateIso),
  listKey: mapReminderListKey(reminder.listKey),
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
