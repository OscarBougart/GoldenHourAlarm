import { View, Modal, Pressable, StyleSheet, type ModalProps } from 'react-native';
import { COLORS } from '@/constants/colors';
import { RADIUS, SPACE } from '@/constants/spacing';

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function BottomSheet({ visible, onClose, children }: BottomSheetProps): React.JSX.Element {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: COLORS.BG_ELEVATED,
    borderTopLeftRadius: RADIUS.LG,
    borderTopRightRadius: RADIUS.LG,
    paddingHorizontal: SPACE.LG,
    paddingBottom: SPACE.XL,
    paddingTop: SPACE.MD,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.BORDER,
    alignSelf: 'center',
    marginBottom: SPACE.MD,
  },
});
