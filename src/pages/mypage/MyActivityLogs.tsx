import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { ActivityLogResponseType } from "../../types/type";
import { getLogMessagesByUserApi } from "../../api/sehodiary-api";
import ActivityLogCard from "../../components/react-native-card/ActivityLogCard";

const MyActivityLogs = () => {
  const [logMessages, setLogMessages] = useState<ActivityLogResponseType[]>([]);

  useEffect(() => {
    getLogMessagesByUserApi()
      .then((res) => {
        setLogMessages(res.data ?? []);
      })
      .catch(() => {
        setLogMessages([]);
      });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>내 활동 내역 ({logMessages.length})</Text>

      {logMessages.length > 0 ? (
        logMessages.map((log) => <ActivityLogCard key={String(log?.id)} log={log} />)
      ) : (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>해당 메시지가 없습니다!</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  emptyBox: {
    paddingVertical: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#f9fafb",
  },
  emptyText: {
    fontSize: 15,
    color: "#6b7280",
  },
});

export default MyActivityLogs;
