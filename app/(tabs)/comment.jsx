  import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Modal,
  StyleSheet,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";
import { baseurl } from "@/hooks/url";

export default function CommentPage() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const styles = getStyles(isDarkMode);

  const [user, setUser] = useState({
    name: "匿名用户",
    avatar: "",
  });

  const [posts, setPosts] = useState([]); 
  const [replyText, setReplyText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");

  // Fetch user information
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const name = await SecureStore.getItemAsync("username");
        const avatar = await SecureStore.getItemAsync("userAvatar");
        setUser({
          name: name || "匿名用户",
          avatar: avatar ? `${baseurl}avatar/${avatar}` : "",
        });
      } catch (error) {
        console.error("Failed to load user info", error);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await fetch(`${baseurl}comment/intro`);
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchUser();
    fetchPosts();
  }, []);

  const likePost = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const addReply = async (postId) => {
    if (!replyText.trim()) {
      Alert.alert("提示", "请输入回复内容后再发布");
      return;
    }

    try {
      const response = await fetch(`${baseurl}comments/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: user.name,
          avatar: user.avatar,
          content: replyText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to post reply");
      }

      const updatedPost = await response.json();

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? updatedPost : post
        )
      );

      setReplyText("");
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const addNewPost = async () => {
    if (!newPostContent.trim()) {
      Alert.alert("提示", "请输入帖子内容后再发布");
      return;
    }

    try {
      const response = await fetch(`${baseurl}/comments/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: user.name,
          avatar: user.avatar,
          content: newPostContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add new post");
      }

      const newPost = await response.json();

      setPosts((prevPosts) => [newPost, ...prevPosts]);
      setNewPostContent("");
      setModalVisible(false);

    } catch (error) {
      Alert.alert("网络问题，请重试！");
      console.error("Error adding new post:", error);
    }
  };

  const renderReply = ({ item }) => (
    <View style={styles.replyContainer}>
      <Image source={{ uri: item.avatar }} style={styles.replyAvatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.userText}>{item.user}</Text>
        <Text style={styles.contentText}>{item.content}</Text>
      </View>
    </View>
  );

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.userInfo}>
        <View style={styles.userDetails}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <Text style={styles.userText}>{item.user}</Text>
        </View>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
      <Text style={styles.contentText}>{item.content}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => likePost(item.id)}>
          <Text style={styles.actionText}>
            <IconSymbol size={18} name="thumb-up" color={styles.actionIcon.color} />
            {item.likes > 0 ? ` ${item.likes}` : " 0"}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={item.replies}
        renderItem={renderReply}
        keyExtractor={(reply) => reply.id}
      />
      <View style={styles.replyInputContainer}>
        <TextInput
          style={styles.replyInput}
          placeholder="发表评论..."
          placeholderTextColor={isDarkMode ? "#aaa" : "#333"}
          value={replyText}
          onChangeText={setReplyText}
        />
        <TouchableOpacity onPress={() => addReply(item.id)}>
          <Text style={styles.publishText}>发布</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <IconSymbol size={28} name="add" color={"#fff"} />
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <TextInput
              style={styles.input}
              placeholder="请输入新内容"
              placeholderTextColor={isDarkMode ? "#aaa" : "#333"}
              value={newPostContent}
              onChangeText={setNewPostContent}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.publishButton}
                onPress={addNewPost}
              >
                <Text style={styles.publishText}>发布</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>取消</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: isDarkMode ? "#121212" : "#f9f9f9" },
    listContainer: { padding: 10 },
    postContainer: {
      backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
      marginBottom: 10,
      padding: 15,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    userInfo: {
      flexDirection: "row",
      justifyContent: "space-between", 
      alignItems: "center",
      marginBottom: 10,
    },
    userDetails: {
      flexDirection: "row", 
      alignItems: "center", 
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
      borderColor: isDarkMode ? "#333" : "#ccc",
      borderWidth: 1,
    },
    userText: {
      fontSize: 16,
      fontWeight: "bold",
      color: isDarkMode ? "#fff" : "#333",
    },
    timeText: {
      fontSize: 14,
      color: isDarkMode ? "#bbbbbb" : "#aaa",
    },
    contentText: { fontSize: 14, color: isDarkMode ? "#fff" : "#333" },
    actions: { flexDirection: "row", marginTop: 10 },
    actionText: { marginRight: 20, fontSize: 14, color: isDarkMode ? "#bbb" : "#333", marginTop: 10 },
    actionIcon: { color: isDarkMode ? "#bbbbbb" : "#aaa" },
    replyInputContainer: { flexDirection: "row", alignItems: "center", marginTop: 10 },
    replyInput: {
      flex: 1,
      height: 40,
      backgroundColor: isDarkMode ? "#333333" : "#f0f0f0",
      borderRadius: 8,
      padding: 10,
    },
    fab: {
      position: "absolute",
      right: 20,
      bottom: 30,
      backgroundColor: isDarkMode ? "#0077cc" : "#00aaff",
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: "center",
      justifyContent: "center",
      elevation: 5,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modal: {
      backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
      padding: 20,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    input: {
      height: 100,
      backgroundColor: isDarkMode ? "#333333" : "#f0f0f0",
      borderRadius: 8,
      padding: 10,
      textAlignVertical: "top",
      marginBottom: 10,
    },
    publishButton: {
      backgroundColor: isDarkMode ? "#0077cc" : "#00aaff",
      padding: 10,
      borderRadius: 8,
      alignItems: "center",
    },
    publishText: { color: "#fff", fontWeight: "bold", fontSize: 14, marginLeft: 10 },
    cancelButton: { alignItems: "center", marginTop: 10 },
    cancelText: { color: isDarkMode ? "#0077cc" : "#00aaff", fontSize: 14 },
  });
