import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const COURSES = [
  {
    id: "1",
    title: "Understanding Caro-Kann",
    subtitle: "Master the Caro-Kann Defense from scratch",
    lessons: 12,
    duration: "2h 30m",
    level: "Beginner",
    icon: "shield-outline" as const,
    color: "#F0B429",
  },
  {
    id: "2",
    title: "Sicilian Defense Masterclass",
    subtitle: "Deep dive into the Sicilian Defense variations",
    lessons: 18,
    duration: "3h 45m",
    level: "Intermediate",
    icon: "flash-outline" as const,
    color: "#4CAF50",
  },
  {
    id: "3",
    title: "Endgame Essentials",
    subtitle: "Learn critical endgame techniques",
    lessons: 10,
    duration: "1h 50m",
    level: "Advanced",
    icon: "trophy-outline" as const,
    color: "#2196F3",
  },
];

export default function CoursesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Courses</Text>
        <Text style={styles.headerSubtitle}>
          Interactive video lessons from chess masters
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {COURSES.map((course) => (
          <TouchableOpacity
            key={course.id}
            style={styles.courseCard}
            activeOpacity={0.7}
            onPress={() => router.push(`/course/${course.id}`)}
          >
            <View
              style={[styles.courseIcon, { backgroundColor: course.color + "1A" }]}
            >
              <Ionicons name={course.icon} size={28} color={course.color} />
            </View>
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.courseSubtitle}>{course.subtitle}</Text>
              <View style={styles.courseMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="videocam-outline" size={14} color="#888" />
                  <Text style={styles.metaText}>{course.lessons} lessons</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color="#888" />
                  <Text style={styles.metaText}>{course.duration}</Text>
                </View>
                <View
                  style={[
                    styles.levelBadge,
                    { backgroundColor: course.color + "1A" },
                  ]}
                >
                  <Text style={[styles.levelText, { color: course.color }]}>
                    {course.level}
                  </Text>
                </View>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#555" />
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  headerSubtitle: {
    color: "#888",
    fontSize: 14,
    marginTop: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  courseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  courseIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  courseSubtitle: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },
  courseMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    color: "#888",
    fontSize: 12,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  levelText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
