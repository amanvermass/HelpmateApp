import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { colors, shadow } from '../styles/theme';
import { X, ShieldCheck, CheckCircle2 } from 'lucide-react-native';
import { KycDoc } from '../data/mockData';

interface DocumentViewerModalProps {
  visible: boolean;
  doc: KycDoc | null;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({ visible, doc, onClose }) => {
  if (!doc) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleBox}>
              <Text style={styles.title} numberOfLines={1}>
                {doc.title}
              </Text>
              <View style={styles.badge}>
                <ShieldCheck size={12} color={colors.emeraldText} />
                <Text style={styles.badgeText}>{doc.status}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Doc Content Image Preview */}
          <View style={styles.imageBox}>
            <Image source={{ uri: doc.url }} style={styles.docImage} resizeMode="contain" />
          </View>

          {/* Doc Meta info */}
          <View style={styles.footer}>
            <Text style={styles.metaText}>Document Type: {doc.type}</Text>
            <Text style={styles.metaText}>Uploaded on: {doc.dateUploaded}</Text>
            <Text style={styles.fileName}>File: {doc.fileName}</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: colors.card,
    borderRadius: 20,
    overflow: 'hidden',
    ...shadow.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitleBox: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.emeraldText,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBox: {
    height: 280,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  docImage: {
    width: '100%',
    height: '100%',
  },
  footer: {
    padding: 14,
    backgroundColor: colors.inputBg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  fileName: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: colors.primary,
    marginTop: 4,
  },
});
