import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingsScreen() {
  const [url, setUrl] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      const savedUrl = await AsyncStorage.getItem('ha_url');
      const savedToken = await AsyncStorage.getItem('ha_token');
      if (savedUrl) setUrl(savedUrl);
      if (savedToken) setToken(savedToken);
    };
    loadSettings();
  }, []);

 const saveSettings = async () => {
    if (!url) {
      Alert.alert('Lỗi', 'Anh hai quên nhập Link rồi kìa!');
      return;
    }
    try {
      // Bỏ khoảng trắng dư thừa và dấu '/' ở cuối URL
      let cleanUrl = url.trim().replace(/\/$/, '');
      
      // [Suy luận] Nếu link không bắt đầu bằng http hoặc https, Tèo tự động chèn http:// vào giúp anh hai
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'http://' + cleanUrl;
      }

      await AsyncStorage.setItem('ha_url', cleanUrl);
      await AsyncStorage.setItem('ha_token', token);
      Alert.alert('Ngon lành!', 'Tèo đã lưu lại cấu hình cho anh hai rồi đó.');
    } catch (e) {
      Alert.alert('Lỗi', 'Chà, không thể lưu cài đặt được rồi.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cấu Hình Hệ Thống</Text>
      
      <Text style={styles.label}>Link Home Assistant (VD: http://192.168.1.5:8123):</Text>
      <TextInput 
        style={styles.input} 
        value={url} 
        onChangeText={setUrl} 
        placeholder="http://192.168.x.x:8123" 
        autoCapitalize="none"
      />

      <Text style={styles.label}>Long-Lived Access Token:</Text>
      <TextInput 
        style={styles.input} 
        value={token} 
        onChangeText={setToken} 
        placeholder="Dán token siêu dài của HA vào đây..." 
        secureTextEntry 
      />

      <Button title="Lưu Cài Đặt" onPress={saveSettings} color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 5, marginTop: 10, fontWeight: 'bold' },
  input: { backgroundColor: 'white', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', marginBottom: 15 },
});