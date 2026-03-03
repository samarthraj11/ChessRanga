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
import {
  useVimeoEvent,
  useVimeoOEmbed,
  useVimeoPlayer,
  VimeoView,
} from "react-native-vimeo-bridge";
import { Ionicons } from "@expo/vector-icons";

const COURSES: Record<
  string,
  { title: string; subtitle: string; vimeoUrl: string }
> = {
  "1": {
    title: "Understanding Caro-Kann",
    subtitle: "Master the Caro-Kann Defense from scratch",
    vimeoUrl: "https://player.vimeo.com/video/76979871?h=8272103f6e",
  },
  "2": {
    title: "Sicilian Defense Masterclass",
    subtitle: "Deep dive into the Sicilian Defense variations",
    vimeoUrl: "https://player.vimeo.com/video/76979871?h=8272103f6e",
  },
  "3": {
    title: "Endgame Essentials",
    subtitle: "Learn critical endgame techniques",
    vimeoUrl: "https://player.vimeo.com/video/76979871?h=8272103f6e",
  },
};

const VOLUME_LEVELS = [0.25, 0.5, 0.75, 1.0];
const PLAYBACK_RATES = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
const TIMEUPDATE_THROTTLE_MS = 250;
const VIMEO_PLAYER_OPTIONS = { autoplay: false, controls: true };

const safeNumber = (value: number | undefined | null) => {
  return value ?? 0;
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [currentCourseId, setCurrentCourseId] = useState<string>(id || "1");
  const [autoPlayNext, setAutoPlayNext] = useState(false);
  const course = COURSES[currentCourseId] ?? COURSES["1"];

  const player = useVimeoPlayer(course.vimeoUrl, VIMEO_PLAYER_OPTIONS);

  const [playing, setPlaying] = useState(false);
  const [videoId, setVideoId] = useState<number | undefined>(undefined);

  const loaded = useVimeoEvent(player, "loaded");
  const timeupdate = useVimeoEvent(player, "timeupdate", TIMEUPDATE_THROTTLE_MS);
  const progress = useVimeoEvent(player, "progress");
  const volumeStatus = useVimeoEvent(player, "volumechange");
  const playbackRate = useVimeoEvent(player, "playbackratechange");
  const fullscreen = useVimeoEvent(player, "fullscreenchange");

  const volume = safeNumber(volumeStatus?.volume);
  const currentTime = safeNumber(timeupdate?.seconds);
  const duration = safeNumber(timeupdate?.duration);
  const percent = safeNumber(timeupdate?.percent);
  const loadedFraction = safeNumber(progress?.percent);
  const muted = volumeStatus?.muted;

  useVimeoEvent(player, "ended", () => {
    const courseKeys = Object.keys(COURSES);
    const currentIndex = courseKeys.indexOf(currentCourseId);

    if (currentIndex < courseKeys.length - 1) {
      const nextCourseId = courseKeys[currentIndex + 1];
      setAutoPlayNext(true);
      setCurrentCourseId(nextCourseId);
    } else {
      Alert.alert("Finished", "You have completed all courses!");
    }
  });

  const onPlay = useCallback(async () => {
    if (playing) {
      await player.pause();
      return;
    }
    await player.play();
  }, [playing, player]);

  const toggleMute = useCallback(async () => {
    await player.setMuted(!muted);
  }, [player, muted]);

  const changeVolume = useCallback(
    async (v: number) => {
      const result = await player.setVolume(v);
      if (result) {
        await player.setMuted(false);
      }
    },
    [player]
  );

  const changePlaybackRate = useCallback(
    async (rate: number) => {
      await player.setPlaybackRate(rate);
    },
    [player]
  );

  const getPlayerInfo = useCallback(async () => {
    try {
      const [vid, title, url, width, height] = await Promise.all([
        player.getVideoId(),
        player.getVideoTitle(),
        player.getVideoUrl(),
        player.getVideoWidth(),
        player.getVideoHeight(),
      ]);

      const message =
        `videoId: ${vid}\n` +
        `title: ${title}\n` +
        `url: ${url}\n` +
        `width: ${width}\n` +
        `height: ${height}`;

      if (Platform.OS === "web") {
        alert(message);
      } else {
        Alert.alert("Player Info", message);
      }
    } catch (error) {
      console.error("Error getting player info:", error);
    }
  }, [player]);

  useVimeoEvent(player, "playing", () => {
    setPlaying(true);
  });

  useVimeoEvent(player, "pause", () => {
    setPlaying(false);
  });

  useEffect(() => {
    if (loaded?.id) {
      player.getVideoId().then((vid) => {
        setVideoId(vid);
      }).catch((err) => {
        console.error("Error fetching video ID:", err);
      });
    }
  }, [loaded?.id, player]);

  useEffect(() => {
    if (autoPlayNext && loaded?.id) {
      player.play().catch((err) => {
        console.error("Error auto-playing next video:", err);
      });
      setAutoPlayNext(false);
    }
  }, [autoPlayNext, loaded?.id, player]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#F0B429" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {course.title}
            </Text>
            <Text style={styles.subtitle}>
              {videoId ? `Video ID: ${videoId}` : course.subtitle}
            </Text>
          </View>
        </View>

        {/* Vimeo Video Player */}
        <VimeoView key={currentCourseId} player={player} style={styles.video} />

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.timeText}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.bufferFill,
                { width: `${loadedFraction * 100}%` },
              ]}
            />
            <View
              style={[styles.progressFill, { width: `${percent * 100}%` }]}
            />
          </View>
          <Text style={styles.bufferText}>
            Buffered: {Math.round(loadedFraction * 100)}%
          </Text>
        </View>

        {/* Playback Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.button, styles.playButton]}
            onPress={onPlay}
          >
            <Ionicons
              name={playing ? "pause" : "play"}
              size={20}
              color="#fff"
            />
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
          <Text style={styles.volumeText}>
            Volume: {Math.round(volume * 100)}%{muted ? " (Muted)" : ""}
          </Text>
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
                  playbackRate?.playbackRate === r && styles.activeButton,
                ]}
                onPress={() => changePlaybackRate(r)}
              >
                <Text style={styles.buttonText}>{r}x</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Fullscreen Controls */}
        <View style={styles.fullscreenSection}>
          <Text style={styles.sectionTitle}>Fullscreen</Text>
          <View style={styles.fullscreenControls}>
            <TouchableOpacity
              style={[
                styles.fullscreenButton,
                fullscreen?.fullscreen && styles.activeButton,
              ]}
              onPress={() => player.requestFullscreen()}
            >
              <Text style={styles.buttonText}>Enter</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.fullscreenButton}
              onPress={() => player.exitFullscreen()}
            >
              <Text style={styles.buttonText}>Exit</Text>
            </TouchableOpacity>
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
    position: "relative",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#F0B429",
    borderRadius: 3,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 2,
  },
  bufferFill: {
    height: "100%",
    backgroundColor: "rgba(240, 180, 41, 0.3)",
    borderRadius: 3,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
  },
  bufferText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginTop: 4,
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
    marginBottom: 8,
  },
  volumeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#2E2E4E",
    borderRadius: 6,
    minWidth: 55,
  },
  volumeText: {
    textAlign: "center",
    color: "#888",
    fontSize: 14,
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
  fullscreenSection: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
    padding: 16,
    backgroundColor: "#1A1A2E",
    borderRadius: 12,
  },
  fullscreenButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#2E2E4E",
    borderRadius: 6,
    minWidth: 60,
  },
  fullscreenControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  activeButton: {
    backgroundColor: "#F0B429",
  },
});
