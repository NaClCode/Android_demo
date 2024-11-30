import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet, ScrollView, Modal, TextInput, ActivityIndicator, } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import {baseurl} from "@/hooks/url";

export default function UserProfile() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = getStyles(isDarkMode);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newAvatar, setNewAvatar] = useState('');

  const loadUserData = async () => {
    try {
      const name = await SecureStore.getItemAsync('username');
      const email = await SecureStore.getItemAsync('userEmail');
      const avatar = await SecureStore.getItemAsync('userAvatar');

      if (name && email) {
        if (avatar){
          const url = `${baseurl}avatar/${avatar}`;
          setUserData({ name, email, url});
        }else{
          const url = null;
          setUserData({ name, email, url});
        }
      } else {
        setUserData(null); 
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  const handleLogout = async () => {
    const token = await SecureStore.getItemAsync('userToken');
      if (!token) {
        Alert.alert('未登录', '请先登录以进行修改');
        router.push('/login'); 
        return;
      }

    Alert.alert(
      '注销登录',
      '确定要注销登录吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          onPress: async () => {
            await SecureStore.deleteItemAsync('userName');
            await SecureStore.deleteItemAsync('userEmail');
            await SecureStore.deleteItemAsync('userAvatar');
            await SecureStore.deleteItemAsync('userToken');
            await SecureStore.deleteItemAsync('userID');
            setUserData(null);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const saveToSecureStore = async (key, value) => {
    try {
      await SecureStore.setItemAsync(key, value);
      console.log(`Saved ${key} to SecureStore.`);
    } catch (error) {
      console.error("Failed to save data to SecureStore:", error);
    }
  };

  const handleSaveChanges = async () => {

    const token = await SecureStore.getItemAsync('userToken');
    if (!token) {
      Alert.alert('未登录', '请先登录以进行修改');
      router.push('/login');
      return;
    }

    console.log(newPassword)
    console.log(newAvatar)
    if (!newPassword && !newAvatar) {
      Alert.alert('没有更改', '请输入要更新的内容');
      return;
    }
    
    setIsLoading(true);

    if (newPassword) {
      try {
        const response = await fetch(baseurl + 'user/updateInfo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: userData.name, 
            password: newPassword, 
          }),
        });
  
        const data = await response.json();
        if (data.status === 0) {
          Alert.alert('密码更新成功', '您的密码已更新');
        } else {
          Alert.alert('更新失败', data.message || '服务器发生错误');
          setIsLoading(false); 
          return; 
        }
      } catch (error) {
        console.error('密码更新失败:', error);
        setIsLoading(false); 
        Alert.alert('更新失败', '请检查网络连接或稍后再试');
        return;
      }
    }
  
    if (newAvatar) {
      const avatarUri = newAvatar;
      const fileName = avatarUri.split('/').pop();
      const fileType = `image/${fileName.split('.').pop()}`;
  
      const formData = new FormData();
      formData.append('file', {
        uri: avatarUri,
        name: fileName,
        type: fileType,
      });
  
      try {
        const avatarResponse = await fetch(baseurl + 'user/uploadAvatar', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
  
        const avatarData = await avatarResponse.json();
        if (avatarData.status === 0) {
          Alert.alert('头像更新成功', '您的头像已更新');
          
          setUserData(({ email, name, ...rest }) => ({
            email,                
            name,                
            url: `${baseurl}avatar/${avatarData.avatar}`    
          }));

          await saveToSecureStore("userAvatar", avatarData.avatar);
         
        } else {
          Alert.alert('上传失败', avatarData.message || '服务器发生错误');
          setIsLoading(false); 
        }
      } catch (error) {
        console.error('头像上传失败:', error);
        Alert.alert('上传失败', '请检查网络连接或稍后再试');
        setIsLoading(false); 
      }
    }
    setIsLoading(false); 
    setModalVisible(false);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('权限不足', '需要权限才能选择图片');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    

    if (!result.canceled) {
      setNewAvatar(result.assets[0].uri);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {userData ? (
        <>
          <View style={styles.header}>
            <Image
              source=   {{ uri: userData.url}}
              style={styles.avatar}
            />
            <Text style={styles.userName}>{userData.name}</Text>
            <Text style={styles.email}>{userData.email}</Text>
          </View>

          {isLoading && (
          <Modal transparent={true} visible={isLoading}>
            <View style={styles.modalContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text>正在更新...</Text>
            </View>
          </Modal>
        )}

          <View style={styles.list}>
            <TouchableOpacity style={styles.listItem} onPress={() => setModalVisible(true)}>
              <Text style={styles.listItemText}>修改个人信息</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.listItem} onPress={handleLogout}>
              <Text style={styles.listItemText}>注销</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.unloggedContainer}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png' }}
            style={styles.unloggedImage}
          />
          <Text style={styles.unloggedText}>您尚未登录</Text>
          <Text style={styles.unloggedSubText}>请登录以查看您的账户信息</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={handleLoginRedirect}>
            <Text style={styles.buttonText}>立即登录</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>修改个人信息</Text>

            <Text style={styles.modalSubtitle}>修改密码</Text>

            <TextInput
              style={styles.input}
              placeholder=""
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />

            <Text style={styles.modalSubtitle}>更换头像</Text>
            <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
              <Text style={styles.imagePickerButtonText}>选择新头像</Text>
            </TouchableOpacity>
            {newAvatar ? (
              <Image source={{ uri: newAvatar }} style={styles.selectedImage} />
            ) : null}

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSaveChanges}>
                <Text style={styles.modalButtonText}>保存</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: isDarkMode ? '#121212' : '#f9f9f9',
      alignItems: 'center',
      flexGrow: 1,
    },
    header: {
      marginBottom: 24,
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff',
      padding: 20,
      borderRadius: 12,
      shadowColor: isDarkMode ? '#000' : '#ccc',
      shadowOpacity: 0.2,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      width: '100%',
      maxWidth: 600,
      elevation: 10,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 3,
      borderColor: isDarkMode ? '#444' : '#e0e0e0',
      marginBottom: 16,
    },
    userName: {
      fontSize: 22,
      fontWeight: 'bold',
      color: isDarkMode ? '#f5f5f5' : '#333',
    },
    email: {
      fontSize: 14,
      color: isDarkMode ? '#aaaaaa' : '#777',
    },
    list: {
      width: '100%',
      maxWidth: 600,
      backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff',
      borderRadius: 12,
      shadowColor: isDarkMode ? '#000' : '#ccc',
      shadowOpacity: 0.2,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 10,
    },
    listItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#444' : '#eee',
    },
    listItemText: {
      fontSize: 16,
      color: isDarkMode ? '#f5f5f5' : '#333',
    },
    unloggedContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 50,
      padding: 50,
      backgroundColor: isDarkMode ? '#1f1f1f' : '#ffffff',
      borderRadius: 12,
      elevation: 10,
    },
    unloggedImage: {
      width: 120,
      height: 120,
      marginBottom: 20,
      opacity: isDarkMode ? 0.8 : 1,
    },
    unloggedText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: isDarkMode ? '#ffffff' : '#333',
      marginBottom: 8,
      textAlign: 'center',
    },
    unloggedSubText: {
      fontSize: 16,
      color: isDarkMode ? '#aaaaaa' : '#777',
      textAlign: 'center',
      marginBottom: 20,
    },
    primaryButton: {
      backgroundColor: isDarkMode ? '#3498db' : '#4caf50',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      backgroundColor: isDarkMode ? '#333' : '#fff',
      padding: 20,
      borderRadius: 12,
      width: '80%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      color: isDarkMode ? '#fff' : '#333',
      textAlign: 'center',
    },
    modalSubtitle: {
      fontSize: 14,
      color: isDarkMode ? '#aaa' : '#555',
      marginBottom: 10
    },
    input: {
      height: 40,
      borderColor: isDarkMode ? '#444' : '#ccc',
      borderWidth: 1,
      marginBottom: 16,
      paddingHorizontal: 8,
      borderRadius: 8,
      backgroundColor: isDarkMode ? '#333' : '#eee',
      color: isDarkMode ? '#fff' : '#333',
    },
    imagePickerButton: {
      backgroundColor: isDarkMode ? '#444' : '#eee',
      padding: 10,
      borderColor: isDarkMode ? '#444' : '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 20,   
    },
    imagePickerButtonText: {
      color: isDarkMode ? '#fff' : '#444',
      fontWeight: 'bold',
    },
    selectedImage: {
      width: 100,
      height: 100,
      marginTop: 10,
      borderRadius: 50,
      resizeMode: 'cover',
    },
    modalActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      gap: 20,
    },
    modalButton: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
      flex: 1,
    },
    cancelButton: {
      backgroundColor: isDarkMode ? '#444' : '#eee',
      
    },
    saveButton: {
      backgroundColor: isDarkMode ? '#444' : '#eee',
    },
    modalButtonText: {
      color: isDarkMode ? '#fff' : '#000',
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
