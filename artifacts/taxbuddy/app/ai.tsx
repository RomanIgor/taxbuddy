import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  FlatList,
  Platform,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";

import { useColors } from "@/hooks/useColors";
import { useProfile } from "@/contexts/ProfileContext";
import { useIncomes } from "@/contexts/IncomeContext";
import { answerQuestion } from "@/data/aiKnowledge";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Wie hoch ist die Kleinunternehmergrenze?",
  "Was ist die Homeoffice-Pauschale?",
  "Wie funktioniert die Kilometerpauschale?",
  "Geschenke an Kunden – was geht?",
  "GWG-Grenze 800 €?",
];

export default function AiScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile } = useProfile();
  const { ytdRevenue } = useIncomes();
  const listRef = useRef<FlatList<Message>>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: profile?.name
        ? `Hi ${profile.name}, ich bin dein TAXbuddy-Assistent. Frag mich alles rund um deine Steuern – ich kenne § 19 UStG, Homeoffice-Pauschale, Kilometerpauschale, GWG, Bewirtung, Geschenke und mehr.`
        : "Hi, ich bin dein TAXbuddy-Assistent. Frag mich alles rund um deine Steuern.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const userMsg: Message = {
      id: Date.now().toString() + "u",
      role: "user",
      content: q,
    };
    setMessages((m) => [userMsg, ...m]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = answerQuestion(q, { profile, ytdRevenue });
      setMessages((m) => [
        {
          id: Date.now().toString() + "a",
          role: "assistant",
          content: reply,
        },
        ...m,
      ]);
      setTyping(false);
    }, 700);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        ref={listRef}
        data={messages}
        inverted
        keyExtractor={(m) => m.id}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: 16, paddingTop: 24 },
        ]}
        ListHeaderComponent={
          typing ? (
            <View style={styles.typingRow}>
              <View
                style={[
                  styles.bubble,
                  styles.assistantBubble,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View style={styles.typingDots}>
                  <View
                    style={[styles.dot, { backgroundColor: colors.mutedForeground }]}
                  />
                  <View
                    style={[styles.dot, { backgroundColor: colors.mutedForeground }]}
                  />
                  <View
                    style={[styles.dot, { backgroundColor: colors.mutedForeground }]}
                  />
                </View>
              </View>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.row,
              item.role === "user" ? styles.rowRight : styles.rowLeft,
            ]}
          >
            <View
              style={[
                styles.bubble,
                item.role === "user"
                  ? {
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                    }
                  : {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
              ]}
            >
              <Text
                style={{
                  color:
                    item.role === "user"
                      ? colors.primaryForeground
                      : colors.foreground,
                  fontFamily: "Inter_500Medium",
                  fontSize: 14,
                  lineHeight: 20,
                }}
              >
                {item.content}
              </Text>
            </View>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.suggestions}>
            <Text
              style={{
                color: colors.mutedForeground,
                fontFamily: "Inter_500Medium",
                fontSize: 12,
                marginBottom: 8,
              }}
            >
              Vorschläge
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {SUGGESTIONS.map((s) => (
                <Pressable
                  key={s}
                  onPress={() => send(s)}
                  style={({ pressed }) => [
                    styles.suggestionChip,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: colors.foreground,
                      fontFamily: "Inter_500Medium",
                      fontSize: 12,
                    }}
                  >
                    {s}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
      />

      <View
        style={[
          styles.inputBar,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            paddingBottom: (Platform.OS === "web" ? 12 : insets.bottom) + 12,
          },
        ]}
      >
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Frage tippen..."
          placeholderTextColor={colors.mutedForeground}
          style={[
            styles.textInput,
            {
              backgroundColor: colors.muted,
              color: colors.foreground,
            },
          ]}
          multiline
          onSubmitEditing={() => send(input)}
        />
        <Pressable
          onPress={() => send(input)}
          disabled={!input.trim()}
          style={({ pressed }) => [
            styles.sendButton,
            {
              backgroundColor: input.trim() ? colors.primary : colors.muted,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Feather
            name="arrow-up"
            size={20}
            color={input.trim() ? colors.primaryForeground : colors.mutedForeground}
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: {
    paddingHorizontal: 16,
  },
  row: {
    width: "100%",
    marginVertical: 4,
  },
  rowLeft: { alignItems: "flex-start" },
  rowRight: { alignItems: "flex-end" },
  bubble: {
    maxWidth: "85%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
  },
  assistantBubble: {
    alignSelf: "flex-start",
  },
  typingRow: {
    width: "100%",
    alignItems: "flex-start",
    paddingHorizontal: 0,
    marginBottom: 6,
  },
  typingDots: {
    flexDirection: "row",
    gap: 4,
    paddingVertical: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.6,
  },
  suggestions: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  suggestionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 14,
    paddingTop: 10,
    gap: 10,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontFamily: "Inter_500Medium",
    fontSize: 14,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
