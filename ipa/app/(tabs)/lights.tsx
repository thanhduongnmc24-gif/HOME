import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LightsScreen() {
  // [Suy luận] Anh hai nhớ đổi cái ID này cho đúng với nhà mình nhé!
  const entityId = 'light.demo_light'; 

  const toggleLight = async () => {
    const url = await AsyncStorage.getItem('ha_url');
    const token = await AsyncStorage.getItem('ha_token');

    if (!url || !token) {
      Alert.alert('Ê chột dạ!', 'Anh hai chưa nhập Link hoặc Token bên tab Cài Đặt kìa.');
      return;
    }

    try {
      const response = await fetch(`${url}/api/services/light/toggle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entity_id: entityId }),
      });

      if (response.ok) {
        Alert.alert('Tạch!', 'Đã gửi lệnh bật/tắt tới đèn.');
      } else {
        Alert.alert('Xịt rồi', 'Lệnh gửi đi thất bại, mã lỗi: ' + response.status);
      }
    } catch (error) {
      Alert.alert('Mất mạng', 'Không thể kết nối đến máy chủ Home Assistant.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bảng Điều Khiển Nhanh</Text>
      <TouchableOpacity style={styles.button} onPress={toggleLight}>
        <Text style={styles.buttonText}>Bật / Tắt Đèn Demo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 30 },
  button: { backgroundColor: '#fbc531', padding: 20, borderRadius: 50, elevation: 5 },
  buttonText: { fontSize: 18, fontWeight: 'bold', color: '#2f3640' }
});