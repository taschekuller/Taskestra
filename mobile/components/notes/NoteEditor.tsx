import { useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

import { GlassInput } from '@/components/ui/GlassInput';
import { Colors } from '@/constants/Colors';

interface NoteEditorProps {
  title: string;
  content: string;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
}

export const NoteEditor = ({ title, content, onTitleChange, onContentChange }: NoteEditorProps) => {
  const editorRef = useRef<RichEditor>(null);

  const editorStyle = useMemo(
    () => ({
      backgroundColor: 'transparent',
      color: Colors.glassText,
      placeholderColor: Colors.glassSubtext,
      contentCSSText:
        'font-size: 16px; line-height: 1.5; color: rgba(255,255,255,0.95); background-color: transparent;',
    }),
    [],
  );

  return (
    <View style={styles.container}>
      <GlassInput label="Title" value={title} onChangeText={onTitleChange} placeholder="Note title" />

      <View style={styles.editorWrap}>
        <RichEditor
          ref={editorRef}
          useContainer
          initialContentHTML={content}
          editorStyle={editorStyle}
          style={styles.editor}
          placeholder="Write your note..."
          onChange={onContentChange}
        />
      </View>

      <RichToolbar
        editor={editorRef}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.insertBulletsList,
          actions.insertOrderedList,
        ]}
        style={styles.toolbar}
        iconTint={Colors.glassText}
        selectedIconTint={Colors.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
    flex: 1,
  },
  editorWrap: {
    minHeight: 260,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  editor: {
    minHeight: 260,
    paddingHorizontal: 12,
  },
  toolbar: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
  },
});
