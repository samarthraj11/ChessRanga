import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function CoursesScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Courses</Text>
      </View>
      <View style={styles.content}>
        <Ionicons name="book-outline" size={64} color="#333" />
        <Text style={styles.emptyTitle}>Coming Soon</Text>
        <Text style={styles.emptySubtitle}>
          Chess courses will be available here.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F1A",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    color: "#F0B429",
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  emptySubtitle: {
    color: "#888",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 40,
  },
});
