import * as Haptics from 'expo-haptics';

/** Light tap — list item selection, toggle */
export function tapLight(): void {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

/** Medium tap — primary button press, save */
export function tapMedium(): void {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

/** Heavy tap — destructive actions (delete confirm) */
export function tapHeavy(): void {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
}

/** Success notification — recipe saved, action complete */
export function notifySuccess(): void {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

/** Error notification — validation failure, destructive confirm */
export function notifyError(): void {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}
