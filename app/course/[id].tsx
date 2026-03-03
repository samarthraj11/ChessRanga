import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEvent } from "expo";
import { Ionicons } from "@expo/vector-icons";

const COURSES: Record<
  string,
  { title: string; subtitle: string; videoUrl: string }
> = {
  "1": {
    title: "Understanding Caro-Kann",
    subtitle: "Master the Caro-Kann Defense from scratch",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  "2": {
    title: "Sicilian Defense Masterclass",
    subtitle: "Deep dive into the Sicilian Defense variations",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  "3": {
    title: "Endgame Essentials",
    subtitle: "Learn critical endgame techniques",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
};

const VOLUME_LEVELS = [0.25, 0.5, 0.75, 1.0];
const PLAYBACK_RATES = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const course = COURSES[id] ?? COURSES["1"];

  const player = useVideoPlayer(course.videoUrl, (p) => {
    p.loop = false;
    p.volume = 1.0;
    p.playbackRate = 1.0;
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  const { currentTime } = useEvent(player, "timeUpdate", {
    currentTime: player.currentTime,
    currentOffsetFromLive: 0,
    currentLiveTimestamp: 0,
    bufferedPosition: 0,
  });

  const [volume, setVolume] = useState(1.0);
  const [muted, setMuted] = useState(false);
  const [rate, setRate] = useState(1.0);

  const duration = player.duration;
  const percent = duration > 0 ? currentTime / duration : 0;

  const onPlayPause = useCallback(() => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  }, [isPlaying, player]);

  const onSeekBack = useCallback(() => {
    player.seekBy(-10);
  }, [player]);

  const onSeekForward = useCallback(() => {
    player.seekBy(10);
  }, [player]);

  const toggleMute = useCallback(() => {
    const newMuted = !player.muted;
    player.muted = newMuted;
    setMuted(newMuted);
  }, [player]);

  const changeVolume = useCallback(
    (v: number) => {
      player.volume = v;
      setVolume(v);
      if (v > 0) {
        player.muted = false;
        setMuted(false);
      }
    },
    [player]
  );

  const changePlaybackRate = useCallback(
    (r: number) => {
      player.playbackRate = r;
      setRate(r);
    },
    [player]
  );

  const getPlayerInfo = useCallback(() => {
    if (Platform.OS === "web") {
      alert(
        `Title: ${course.title}\nDuration: ${formatTime(duration)}\nCurrent Time: ${formatTime(currentTime)}`
      );
    } else {
      Alert.alert(
        "Course Info",
        `Title: ${course.title}\nDuration: ${formatTime(duration)}\nCurrent Time: ${formatTime(currentTime)}`
      );
    }
  }, [course.title, duration, currentTime]);

  useEffect(() => {
    return () => {
      player.pause();
    };
  }, [player]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#F0B429" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {course.title}
            </Text>
            <Text style={styles.subtitle}>{course.subtitle}</Text>
          </View>
        </View>

        {/* Video Player */}
        <VideoView
          style={styles.video}
          player={player}
          nativeControls={false}
          contentFit="contain"
        />

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.timeText}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${percent * 100}%` }]}
            />
          </View>
        </View>

        {/* Playback Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.button, styles.seekButton]}
            onPress={onSeekBack}
          >
            <Text style={styles.buttonText}>-10s</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.playButton]}
            onPress={onPlayPause}
          >
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.seekButton]}
            onPress={onSeekForward}
          >
            <Text style={styles.buttonText}>+10s</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.infoButton]}
            onPress={getPlayerInfo}
          >
            <Ionicons name="information-circle" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Volume Controls */}
        <View style={styles.volumeSection}>
          <Text style={styles.sectionTitle}>Volume</Text>
          <View style={styles.volumeControls}>
            <TouchableOpacity
              style={[styles.volumeButton, muted && styles.activeButton]}
              onPress={toggleMute}
            >
              <Text style={styles.buttonText}>
                {muted ? "Unmute" : "Mute"}
              </Text>
            </TouchableOpacity>
            {VOLUME_LEVELS.map((v) => (
              <TouchableOpacity
                key={v}
                style={[
                  styles.volumeButton,
                  volume === v && styles.activeButton,
                ]}
                onPress={() => changeVolume(v)}
              >
                <Text style={styles.buttonText}>{Math.round(v * 100)}%</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Playback Rate Controls */}
        <View style={styles.speedSection}>
          <Text style={styles.sectionTitle}>Playback Speed</Text>
          <View style={styles.speedControls}>
            {PLAYBACK_RATES.map((r) => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.speedButton,
                  rate === r && styles.activeButton,
                ]}
                onPress={() => changePlaybackRate(r)}
              >
                <Text style={styles.buttonText}>{r}x</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F1A",
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1A1A2E",
    borderBottomWidth: 1,
    borderBottomColor: "#2E2E4E",
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F0B429",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  video: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#000",
  },
  progressContainer: {
    padding: 16,
    backgroundColor: "#1A1A2E",
  },
  timeText: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#2E2E4E",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#F0B429",
    borderRadius: 3,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1A1A2E",
    marginTop: 1,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 60,
    alignItems: "center",
  },
  playButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 24,
  },
  seekButton: {
    backgroundColor: "#2196F3",
  },
  infoButton: {
    backgroundColor: "#9C27B0",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#F0B429",
  },
  volumeSection: {
    margin: 16,
    marginBottom: 8,
    padding: 16,
    backgroundColor: "#1A1A2E",
    borderRadius: 12,
  },
  volumeControls: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  volumeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#2E2E4E",
    borderRadius: 6,
    minWidth: 55,
  },
  speedSection: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    padding: 16,
    backgroundColor: "#1A1A2E",
    borderRadius: 12,
  },
  speedControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  speedButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#2E2E4E",
    borderRadius: 6,
    marginBottom: 8,
    minWidth: 50,
  },
  activeButton: {
    backgroundColor: "#F0B429",
  },
});
