import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; 
import DateTimePicker from "@react-native-community/datetimepicker"; 
import { useColorScheme } from "@/hooks/useColorScheme";

export default function Signup() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const styles = getStyles(isDarkMode);

  const [competitions, setCompetitions] = useState([
    { id: "1", name: "编程大赛", date: "2024-12-01", teammates: "张三" },
    { id: "2", name: "算法挑战赛", date: "2024-12-15", teammates: "李四, 王五" },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newCompetition, setNewCompetition] = useState({
    name: "编程大赛",
    date: new Date(),
    teammates: "",
  }); 
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAddCompetition = () => {
    if (!newCompetition.name.trim() || !newCompetition.teammates.trim()) {
      Alert.alert("提示", "请填写完整的比赛信息");
      return;
    }
    setCompetitions([
      ...competitions,
      {
        id: Date.now().toString(),
        name: newCompetition.name,
        date: newCompetition.date.toISOString().split("T")[0], 
        teammates: newCompetition.teammates,
      },
    ]);
    setNewCompetition({ name: "编程大赛", date: new Date(), teammates: "" });
    setModalVisible(false);
  };

  const renderCompetition = ({ item }) => (
    <View style={styles.competitionItem}>
      <Text style={styles.competitionName}>{item.name}</Text>
      <Text style={styles.competitionDate}>日期: {item.date}</Text>
      <Text style={styles.competitionTeammates}>队友: {item.teammates}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>我报名的比赛</Text>
      <FlatList
        data={competitions}
        renderItem={renderCompetition}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>添加比赛</Text>

            <Picker
              selectedValue={newCompetition.name}
              onValueChange={(value) =>
                setNewCompetition({ ...newCompetition, name: value })
              }
              style={styles.picker}
            >
              <Picker.Item label="编程大赛" value="编程大赛" />
              <Picker.Item label="算法挑战赛" value="算法挑战赛" />
              <Picker.Item label="AI创新大赛" value="AI创新大赛" />
            </Picker>

            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerText}>
                {newCompetition.date.toISOString().split("T")[0]}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={newCompetition.date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setNewCompetition({ ...newCompetition, date: selectedDate });
                  }
                }}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="队友 (以逗号分隔)"
              placeholderTextColor={isDarkMode ? "#aaa" : "#666"}
              value={newCompetition.teammates}
              onChangeText={(text) =>
                setNewCompetition({ ...newCompetition, teammates: text })
              }
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleAddCompetition}
              >
                <Text style={styles.modalButtonText}>添加</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>取消</Text>
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
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? "#121212" : "#f9f9f9",
      padding: 20,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 10,
      color: isDarkMode ? "#fff" : "#333",
    },
    listContainer: { paddingBottom: 80 },
    competitionItem: {
      backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
      padding: 15,
      borderColor: isDarkMode ? '#2a2a2a': '#ddd',
      borderWidth: 1,
      marginBottom: 10,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,

    },
    competitionName: {
      fontSize: 18,
      fontWeight: "bold",
      color: isDarkMode ? "#fff" : "#333",
    },
    competitionDate: { fontSize: 14, color: isDarkMode ? "#aaa" : "#777", marginTop: 5 },
    competitionTeammates: {
      fontSize: 14,
      color: isDarkMode ? "#aaa" : "#777",
      marginTop: 5,
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
    fabText: { fontSize: 24, color: "#fff", fontWeight: "bold" },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      width: "90%",
      backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
      borderRadius: 8,
      padding: 20,
      alignItems: "center",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
      color: isDarkMode ? "#fff" : "#333",
    },
    picker: {
      width: "100%",
      height: 50,
      marginBottom: 15,
      color: isDarkMode ? "#fff" : "#000",
      borderRadius: 8,
     
      
    },
    datePickerButton: {
      width: "100%",
      padding: 10,
      backgroundColor: isDarkMode ? "#333" : "#eee",
      borderRadius: 8,
      alignItems: "center",
      marginBottom: 15,
    },
    datePickerText: {
      color: isDarkMode ? "#fff" : "#000",
      fontSize: 16,
    },
    input: {
      width: "100%",
      height: 40,
      borderColor: isDarkMode ? "#333" : "#ccc",
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 15,
      color: isDarkMode ? "#fff" : "#000",
    },
    modalActions: { flexDirection: "row", marginTop: 10 },
    modalButton: {
      backgroundColor: isDarkMode ? "#0077cc" : "#00aaff",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      marginHorizontal: 5,
    },
    cancelButton: { backgroundColor: isDarkMode ? "#444" : "#ccc" },
    modalButtonText: { color: "#fff", fontWeight: "bold" },
  });
