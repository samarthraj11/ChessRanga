import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Image
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Ionicons} from "@expo/vector-icons";


function QuickActionCard({
                             icon,
                             title,
                             subtitle,
                             color,
                             iconBg,
                         }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
    color: string;
    iconBg: string;
}) {
    return (
        <TouchableOpacity style={[styles.actionCard, {borderLeftColor: color}]}>
            <View style={[styles.actionIcon, {backgroundColor: iconBg}]}>
                <Ionicons name={icon} size={24} color={color}/>
            </View>
            <View style={styles.actionText}>
                <Text style={styles.actionTitle}>{title}</Text>
                <Text style={styles.actionSubtitle}>{subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#555"/>
        </TouchableOpacity>
    );
}

export default function HomeScreen() {
    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <StatusBar barStyle="light-content" backgroundColor="#1A1A2E"/>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >
                {/* Header */}
                <View className="flex-row justify-between items-center px-5 pt-3 pb-2">
                    <View className="flex-row">
                        <Image
                            source={require("../../assets/images/chess-ranga.png")}
                            className="w-8 h-8 mr-3"
                            tintColor={"#ffffff"}
                        />
                        <Text className="text-white text-[26px] font-medium tracking-widest">ChessRanga</Text>
                    </View>
                    <TouchableOpacity className="p-2 bg-brand-navy rounded-xl">
                        <Ionicons name="notifications-outline" size={24} color="#F0B429"/>
                    </TouchableOpacity>
                </View>

                {/* Hero banner */}
                <View style={styles.heroBanner}>
                    <View style={styles.heroText}>
                        <View className="bg-[#F0B429] px-2 py-1 rounded-3xl self-start mb-1">
                            <Text className="text-black font-bold text-xs">
                                New
                            </Text>
                        </View>
                        <Text style={styles.heroTitle}>Understanding{"\n"}<Text className="text-[#F0B429]">Caro
                            Kann</Text> from Scratch</Text>
                        <TouchableOpacity style={styles.heroButton}>
                            <Text style={styles.heroButtonText}>View Course</Text>
                            <Ionicons name="arrow-forward" size={16} color="#1A1A2E"/>
                        </TouchableOpacity>
                    </View>
                    <Image
                        source={require("../../assets/images/img.png")}
                        className="w-[30%] aspect-[4/5] rounded-2xl ml-4"
                        resizeMode="cover"
                    />
                </View>

                <Text className="font-bold text-white  text-center mt-8 text-3xl">Your final destination{"\n"} to <Text
                    className="text-[#F0B429]">learn
                    chess</Text></Text>

                <View className=" mx-5 mt-4">
                    <View className="border-gray-700 bg-[#1A1A2E] border rounded-2xl p-4 flex-row justify-between">
                        <View className="">
                            <Text className="text-white text-xl font-bold">
                                Courses
                            </Text>
                            <Text className="text-gray-500 text-sm w-60 mt-4">
                                Try fully <Text className="text-white">interactive</Text> courses <Text className="text-white">led by best</Text> from the world of chess.
                            </Text>
                        </View>
                        <Image
                            source={require("../../assets/images/courses.png")}
                            className="w-[20%] aspect-[4/5] rounded-2xl ml-4"
                            resizeMode="cover"
                        />
                    </View>
                </View>
                <View className=" mx-5 mt-4">
                    <View className="border-gray-700 bg-[#1A1A2E] border rounded-2xl p-4 flex-row justify-between">
                        <View className="">
                            <Text className="text-white text-xl font-bold">
                                Tactics
                            </Text>
                            <Text className="text-gray-500 text-sm w-60 mt-4">
                                Solve tactics from <Text className="text-white">real world games</Text>  of your favourite chess players or tournaments.
                            </Text>
                        </View>
                        <Image
                            source={require("../../assets/images/tactics.png")}
                            className="w-[20%] aspect-[4/5] rounded-2xl ml-4"
                            resizeMode="cover"
                        />
                    </View>
                </View>
                <View className=" mx-5 mt-4">
                    <View className="border-gray-700 bg-[#1A1A2E] border rounded-2xl p-4 flex-row justify-between">
                        <View className="">
                            <Text className="text-white text-xl font-bold">
                                Compositions
                            </Text>
                            <Text className="text-gray-500 text-sm w-60 mt-4">
                                Tackle masterworks by the  <Text className="text-white">finest chess composers</Text> through our dedicated composition trainer..
                            </Text>
                        </View>
                        <Image
                            source={require("../../assets/images/compositions.png")}
                            className="w-[20%] aspect-[4/5] rounded-2xl ml-4"
                            resizeMode="cover"
                        />
                    </View>
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <QuickActionCard
                    icon="book-outline"
                    title="Learn Openings"
                    subtitle="Study essential chess openings"
                    color="#F0B429"
                    iconBg="rgba(240,180,41,0.13)"
                />
                <QuickActionCard
                    icon="flash-outline"
                    title="Tactics Trainer"
                    subtitle="Sharpen your tactical vision"
                    color="#4CAF50"
                    iconBg="rgba(76,175,80,0.13)"
                />
                <QuickActionCard
                    icon="trophy-outline"
                    title="Play a Game"
                    subtitle="Challenge yourself or a friend"
                    color="#2196F3"
                    iconBg="rgba(33,150,243,0.13)"
                />
                <QuickActionCard
                    icon="analytics-outline"
                    title="Analyze Games"
                    subtitle="Review and improve your play"
                    color="#9C27B0"
                    iconBg="rgba(156,39,176,0.13)"
                />

                {/* Stats */}
                <Text style={styles.sectionTitle}>Your Progress</Text>
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>0</Text>
                        <Text style={styles.statLabel}>Games Played</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>0</Text>
                        <Text style={styles.statLabel}>Puzzles Solved</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>—</Text>
                        <Text style={styles.statLabel}>Rating</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const BOARD_SIZE = 320;
const CELL_SIZE = BOARD_SIZE / 8;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F0F1A",
    },
    scroll: {
        paddingBottom: 24,
    },
    heroBanner: {
        marginHorizontal: 20,
        marginVertical: 12,
        backgroundColor: "#1A1A2E",
        borderRadius: 20,
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        overflow: "hidden",
    },
    heroText: {
        flex: 1,
    },
    heroTitle: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "600",
        lineHeight: 24,
    },
    heroSubtitle: {
        color: "#aaa",
        fontSize: 13,
        marginTop: 6,
        marginBottom: 16,
    },
    heroButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F0B429",
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
        alignSelf: "flex-start",
        gap: 6,
        marginTop: 12,
    },
    heroButtonText: {
        color: "#1A1A2E",
        fontWeight: "700",
        fontSize: 14,
    },
    heroKing: {
        fontSize: 80,
        opacity: 0.25,
        marginLeft: 10,
    },
    sectionTitle: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "700",
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 12,
    },
    boardWrapper: {
        alignItems: "center",
        marginHorizontal: 20,
    },
    board: {
        width: BOARD_SIZE,
        borderRadius: 8,
        overflow: "hidden",
        borderWidth: 2,
        borderColor: "#F0B429",
    },
    row: {
        flexDirection: "row",
    },
    cell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        alignItems: "center",
        justifyContent: "center",
    },
    darkCell: {
        backgroundColor: "#769656",
    },
    lightCell: {
        backgroundColor: "#EEEED2",
    },
    piece: {
        fontSize: CELL_SIZE * 0.7,
        color: "#1A1A1A",
    },
    whitePiece: {
        fontSize: CELL_SIZE * 0.7,
        color: "#F5F5F5",
        textShadowColor: "#000",
        textShadowOffset: {width: 0, height: 1},
        textShadowRadius: 2,
    },
    actionCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1A1A2E",
        borderRadius: 14,
        padding: 14,
        marginHorizontal: 20,
        marginBottom: 10,
        borderLeftWidth: 4,
    },
    actionIcon: {
        width: 46,
        height: 46,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
    },
    actionText: {
        flex: 1,
    },
    actionTitle: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
    },
    actionSubtitle: {
        color: "#888",
        fontSize: 12,
        marginTop: 2,
    },
    statsRow: {
        flexDirection: "row",
        marginHorizontal: 20,
        gap: 10,
    },
    statCard: {
        flex: 1,
        backgroundColor: "#1A1A2E",
        borderRadius: 14,
        padding: 14,
        alignItems: "center",
    },
    statValue: {
        color: "#F0B429",
        fontSize: 22,
        fontWeight: "800",
    },
    statLabel: {
        color: "#888",
        fontSize: 11,
        marginTop: 4,
        textAlign: "center",
    },
});
